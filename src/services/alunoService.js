import { get_alunos, retorna_categorias_dos_alunos, get_rg, retorna_alunos_por_categoria, salva_dados_alunos, atualiza_dados_cadastro, deleta_aluno, get_alunos_rg, get_alunos_com_filtros, count_alunos_com_filtros } from '../models/alunoModel.js';
import { get_categoria } from '../models/categoriasModel.js';
import { deleta_aluno_historico } from '../models/historicoPagamentoModel.js';
import { deleta_presenca_aluno, get_presenca_by_aluno } from '../models/presencaModel.js';
import { get_responsaveis } from '../models/responsaveisModel.js';
import { salvarOuAtualizarResponsavel } from './responsaveisService.js';
import { get_mensalidades_by_aluno } from '../models/mensalidadesModel.js';
import { criarOuAtualizarUsuario } from './usuariosService.js';
import pool from '../bd/bd.js';

function formataDataNascimento(data) {
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia}`;
}

function dataNascimentoEhFutura(data) {
    const [dia, mes, ano] = data.split('/').map(Number);
    const dataNascimento = new Date(ano, mes - 1, dia);

    if (Number.isNaN(dataNascimento.getTime())) {
        return false;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    dataNascimento.setHours(0, 0, 0, 0);

    return dataNascimento > hoje;
}

export async function listarInformacoesAlunos(filtros = {}) {
    try {
        const alunos = await get_alunos_com_filtros(filtros);
        const total = await count_alunos_com_filtros(filtros);
        const page = filtros.page ? Math.max(1, parseInt(filtros.page)) : 1;
        const limit = filtros.limit ? Math.max(1, parseInt(filtros.limit)) : 10;
        const totalPages = Math.ceil(total / limit);

        return {
            status: 200,
            body: {
                alunos: alunos,
                paginacao: {
                    paginaAtual: page,
                    itensPorPagina: limit,
                    totalItens: total,
                    totalPaginas: totalPages,
                },
            },
        };
    } catch (error) {
        return {
            status: 500,
            body: { mensagem: 'Erro ao listar alunos: ' + error.message },
        };
    }
}

export async function listarAlunoPorRg(rg) {
    const result = await get_alunos_rg(rg);

    if (result.length === 0) {
        return {
            status: 404,
            body: { mensagem: 'Aluno não encontrado!' },
        };
    }

    const mensalidades = await get_mensalidades_by_aluno(rg);
    const presencas = await get_presenca_by_aluno(rg);

    return {
        status: 200,
        body: {
            ...result[0],
            mensalidades: mensalidades,
            presencas: presencas,
        },
    };
}

export async function salvarOuAtualizarAluno(body, rg = null) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        if (dataNascimentoEhFutura(body.data_nascimento)) {
            await connection.rollback();
            return {
                status: 400,
                body: { mensagem: 'Data de nascimento nao pode ser no futuro!' },
            };
        }

        const nomeResponsavel = body.nome_responsavel;
        const telefoneResponsavel = body.telefone_responsavel.replace(/\D/g, '')
        const cpfResponsavel = body.cpf_responsavel.replace(/\D/g, '');

        const dadosAluno = {
            rg: body.rg.replace(/\D/g, ''),
            nome: body.nome,
            telefone: body.telefone.replace(/\D/g, ''),
            data_nascimento: formataDataNascimento(body.data_nascimento),
            mensalidade: 0,
            data_cadastro: new Date(),
            id_categoria: body.id_categoria,
            cpf_responsavel: cpfResponsavel,
        };

        if (rg) {
            await atualiza_dados_cadastro(dadosAluno, rg, connection);
        } else {
            const alunoExistente = await get_alunos_rg(body.rg);
            if (alunoExistente.length) {
                await connection.rollback();
                return {
                    status: 409,
                    body: { mensagem: 'Já existe um aluno cadastrado com este RG!' },
                };
            }
            await salva_dados_alunos(dadosAluno, connection);
        }
        

        if (nomeResponsavel && telefoneResponsavel && cpfResponsavel) {
            await salvarOuAtualizarResponsavel({
                nome: nomeResponsavel,
                telefone: telefoneResponsavel,
                cpf: cpfResponsavel,
            }, connection);
        }

        await criarOuAtualizarUsuario(dadosAluno, connection);

        await connection.commit();
        return {
            status: 201,
            body: { mensagem: 'Aluno cadastrado com sucesso!' },
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

export async function removerAluno(rg_aluno) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        await deleta_presenca_aluno(rg_aluno, connection);
        await deleta_aluno_historico(rg_aluno, connection);

        const resultado = await deleta_aluno(rg_aluno, connection);

        if (resultado['affectedRows'] === 0) {
            await connection.rollback();
            return {
                status: 404,
                body: { mensagem: 'Aluno não encontrado!' },
            };
        }

        await connection.commit();
        return {
            status: 200,
            body: { mensagem: 'Aluno deletado com sucesso!' },
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

export async function listarAlunosPorCategoria(categoria) {
    try {
        const alunos = await retorna_alunos_por_categoria(categoria);
        return {
            status: 200,
            body: { alunos: alunos },
        };
    } catch (err) {
        return {
            status: 500,
            body: { mensagem: err.message },
        };
    }
}

export async function listarRgPorNome(nome) {
    try {
        const alunos = await get_rg(nome);
        return {
            status: 200,
            body: { alunos: alunos },
        };
    } catch (err) {
        return {
            status: 500,
            body: { mensagem: err.message },
        };
    }
}
