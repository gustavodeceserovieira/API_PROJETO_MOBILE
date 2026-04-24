import { atualiza_mensalidade, zera_mensalidade } from '../models/alunoModel.js';
import { insere_historico } from '../models/historicoPagamentoModel.js';
import { get_ajustes } from '../models/ajustesModel.js';
import { get_mensalidades_by_aluno, atualiza_pago_mensalidade, insere_mensalidade, mensalidade_ja_existe, get_mensalidades_filtradas, delete_mensalidades_futuras, gerar_mensalidades_retroativas } from '../models/mensalidadesModel.js';
import pool from '../bd/bd.js';
import { get_alunos } from '../models/alunoModel.js';
import { agendarGeracaoMensalidade } from '../functions/mensalidadeCron.js';

function primeiroDiaDoMes(data) {
    return new Date(data.getFullYear(), data.getMonth(), 1);
}

function* iterarMeses(inicio, fim) {
    let cursor = primeiroDiaDoMes(inicio);
    const limite = primeiroDiaDoMes(fim);

    while (cursor <= limite) {
        yield {
            ano: cursor.getFullYear(),
            mes: cursor.getMonth() + 1,
        };
        cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    }
}

export async function registrarMensalidade(body) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const data = body.data_pagamento;
        if (body.on) {
            const [rg, ...array] = body.rg.split(' ');
            const dados = {
                rg: rg.trim(),
                nome: array.join(' ').trim(),
                mensalidade: 1,
            };
            await atualiza_mensalidade(dados, connection);
            await insere_historico(dados['rg'], dados, data, connection);
        } else {
            const dados = {
                rg: body.rg.split(' ')[0].trim(),
                mensalidade: 0,
            };
            await atualiza_mensalidade(dados, connection);
        }

        await connection.commit();
        return {
            status: 201,
            body: { mensagem: 'Histórico inserido com sucesso!' },
        };
    } catch (err) {
        if (connection) await connection.rollback();
        return {
            status: 500,
            body: { mensagem: err.message },
        };
    } finally {
        if (connection) connection.release();
    }
}

export async function executarViradaMes() {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const dataAtual = new Date().toISOString().split('T')[0];
        const dia = dataAtual.split('-')[2];
        const dataVirada = await get_ajustes();
        const dia_virada = dataVirada['data_virada_mes'];

        if (dia == dia_virada) {
            await zera_mensalidade(connection);
            await connection.commit();
            return {
                status: 200,
                body: { mensagem: 'Mensalidade resetada com sucesso!' },
            };
        }

        await connection.rollback();
        return {
            status: 200,
            body: { mensagem: 'Sem virada de mês para processar hoje.' },
        };
    } catch (err) {
        if (connection) await connection.rollback();
        return {
            status: 500,
            body: { mensagem: err.message },
        };
    } finally {
        if (connection) connection.release();
    }
}


export async function listarMensalidadesByAluno(rg_aluno) {
    try {
        const mensalidades = await get_mensalidades_by_aluno(rg_aluno);
        return {
            status: 200,
            body: { mensalidades: mensalidades },
        };
    } catch (err) {
        return {
            status: 500,
            body: { mensagem: err.message },
        };
    }
}

export async function atualizarPagoMensalidade(id, pago) {
    try {
        const idMensalidade = Number(id);
        if (!Number.isInteger(idMensalidade) || idMensalidade <= 0 || typeof pago !== 'boolean') {
            return {
                status: 400,
                body: { mensagem: 'Parâmetros inválidos. Envie id inteiro e pago booleano.' },
            };
        }

        const result = await atualiza_pago_mensalidade(idMensalidade, pago);
        if (result.affectedRows === 0) {
            return {
                status: 404,
                body: { mensagem: 'Mensalidade não encontrada.' },
            };
        }

        return {
            status: 200,
            body: { mensagem: `Mensalidade atualizada para ${pago ? 'paga' : 'não paga'} com sucesso!` },
        };
    } catch (err) {
        return {
            status: 500,
            body: { mensagem: err.message },
        };
    }
}

export async function sincronizarMensalidadesPendentes() {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const ajustes = await get_ajustes(connection);
        if (!ajustes || !ajustes.data_inicio_aulas || !ajustes.data_fim_aulas) {
            await connection.rollback();
            return {
                status: 200,
                body: { mensagem: 'Ajustes de início/fim das aulas não configurados. Nada para sincronizar.' },
            };
        }

        const dataInicioAulas = new Date(ajustes.data_inicio_aulas);
        const dataFimAulas = new Date(ajustes.data_fim_aulas);
        const hoje = new Date();

        if (Number.isNaN(dataInicioAulas.getTime()) || Number.isNaN(dataFimAulas.getTime())) {
            await connection.rollback();
            return {
                status: 400,
                body: { mensagem: 'Datas de ajustes inválidas.' },
            };
        }

        if (dataInicioAulas > dataFimAulas) {
            await connection.rollback();
            return {
                status: 400,
                body: { mensagem: 'data_inicio_aulas deve ser menor ou igual a data_fim_aulas.' },
            };
        }

        const fimProcessamento = hoje < dataFimAulas ? hoje : dataFimAulas;
        if (fimProcessamento < dataInicioAulas) {
            await connection.rollback();
            return {
                status: 200,
                body: { mensagem: 'Ainda não chegou o período para gerar mensalidades.' },
            };
        }

        const alunos = await get_alunos();
        if (!alunos.length) {
            await connection.commit();
            return {
                status: 200,
                body: { mensagem: 'Nenhum aluno encontrado para gerar mensalidades.', criadas: 0 },
            };
        }

        let criadas = 0;
        const valorMensalidade = Number(ajustes.valor_mensalidade || 0);

        for (const aluno of alunos) {
            for (const { ano, mes } of iterarMeses(dataInicioAulas, fimProcessamento)) {
                const jaExiste = await mensalidade_ja_existe(aluno.rg_aluno, ano, mes, connection);
                if (jaExiste) continue;

                await insere_mensalidade({
                    rg_aluno: aluno.rg_aluno,
                    valor: valorMensalidade,
                    ano,
                    mes,
                }, connection);
                criadas += 1;
            }
        }

        await connection.commit();
        return {
            status: 201,
            body: {
                mensagem: criadas > 0
                    ? 'Mensalidades faltantes geradas com sucesso.'
                    : 'Mensalidades já estão em dia.',
                criadas,
            },
        };
    } catch (err) {
        if (connection) await connection.rollback();
        return {
            status: 500,
            body: { mensagem: err.message },
        };
    } finally {
        if (connection) connection.release();
    }
}

export async function listarMensalidades(mes, ano) {
    try {
        const mesNum = mes ? Number(mes) : null;
        const anoNum = ano ? Number(ano) : null;

        if (mesNum && (mesNum < 1 || mesNum > 12)) {
            return {
                status: 400,
                body: { mensagem: 'Mês inválido. Deve estar entre 1 e 12.' },
            };
        }

        if (anoNum && anoNum < 1900) {
            return {
                status: 400,
                body: { mensagem: 'Ano inválido.' },
            };
        }

        const mensalidades = await get_mensalidades_filtradas(mesNum, anoNum);
        return {
            status: 200,
            body: { mensalidades: mensalidades },
        };
    } catch (err) {
        return {
            status: 500,
            body: { mensagem: err.message },
        };
    }
}

export async function gerarMensalidades(ajustes, connection = null) {
    let conn = connection;
    const controlaTransacao = !connection;
    try {
        if (!conn) {
            conn = await pool.getConnection();
        }

        const { valor_mensalidade, data_virada_mes, data_inicio_aulas } = ajustes;

        if (controlaTransacao) {
            await conn.beginTransaction();
        }

        await delete_mensalidades_futuras(conn);
        await gerar_mensalidades_retroativas(data_inicio_aulas, valor_mensalidade, conn);

        if (controlaTransacao) {
            await conn.commit();
        }

        agendarGeracaoMensalidade(data_virada_mes, valor_mensalidade);

        return {
            status: 200,
            body: { mensagem: 'Mensalidades geradas e agendamento atualizado!' },
        };
    } catch (err) {
        if (conn && controlaTransacao) await conn.rollback();
        return {
            status: 500,
            body: { mensagem: err.message },
        };
    } finally {
        if (!connection && conn) conn.release(); 
    }
}