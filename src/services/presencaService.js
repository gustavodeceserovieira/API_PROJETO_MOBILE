import { get_ajustes } from '../models/ajustesModel.js';
import { get_alunos_rg, retorna_alunos_por_categoria } from '../models/alunoModel.js';
import { retorna_presenca, insere_presenca, deleta_presenca_data, get_datas_lancadas, get_lista_presenca, get_presenca_by_aluno } from '../models/presencaModel.js';
import pool from '../bd/bd.js';

export async function registrarPresencaCategoria(body) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const presenca = body.presenca;
        const alunos = presenca.alunos;

        await deleta_presenca_data(presenca.data_presenca, connection);

        const promises = alunos.map(aluno => {
            const dados = {
                data_presenca: presenca.data_presenca,
                rg_aluno: aluno.rg_aluno,
                presente: aluno.presente,
                id_categoria: presenca.id_categoria,
            };
            return insere_presenca(dados, connection);
        });

        await Promise.all(promises);

        await connection.commit();
        return {
            status: 201,
            body: { mensagem: 'Presença registrada com sucesso!' },
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

export async function listarHistoricoPresenca() {
    try {
        const alunos = await retorna_presenca();
        return {
            status: 200,
            body: { data: alunos },
        };
    } catch (err) {
        return {
            status: 500,
            body: { mensagem: err.message },
        };
    }
}

export async function listarDatasLancadas() {
    try {
        const datas = await get_datas_lancadas();
        return {
            status: 200,
            body: { 
                datas: datas,
            },
        };
    } catch (err) {
        return {
            status: 500,
            body: { mensagem: err.message },
        };
    }
}

export async function listarPresencaPorDataECategoria(data, id_categoria) {
    try {
        if (!data || !id_categoria) {
            return {
                status: 400,
                body: { mensagem: 'Parâmetros data e id_categoria são obrigatórios' },
            };
        }

        const presencas = await get_lista_presenca(data, id_categoria);
        return {
            status: 200,
            body: { data: presencas },
        };
    } catch (err) {
        return {
            status: 500,
            body: { mensagem: err.message },
        };
    }
}

export async function listarPresencaPorAluno(rg_aluno) {
    try {
        if (!rg_aluno) {
            return {
                status: 400,
                body: { mensagem: 'Parâmetro rg é obrigatório' },
            };
        }

        const presencas = await get_presenca_by_aluno(rg_aluno);
        return {
            status: 200,
            body: { data: presencas },
        };
    } catch (err) {
        return {
            status: 500,
            body: { mensagem: err.message },
        };
    }
}