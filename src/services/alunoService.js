import {
    get_alunos, get_rg, retorna_alunos_por_categoria, salva_dados_alunos, atualiza_dados_cadastro, deleta_aluno,
    get_alunos_rg
} from '../models/alunoModel.js';
import { get_ajustes } from '../models/ajustesModel.js';
import { get_categoria } from '../models/categoriasModel.js';
import { deleta_aluno_historico, atualiza_historico_pagamento } from '../models/historicoPagamentoModel.js';
import { deleta_presenca_aluno, atualiza_historico_presenca } from '../models/presencaModel.js';
import { salva_dados_resp, deleta_responsaveis_aluno } from '../models/responsaveisModel.js';
import pool from '../bd/bd.js';
import { formataData } from '../functions/functions.js';

export async function cadastraAluno(data) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const dia = new Date();
        const nro_faltas = 0;
        const ajustes = await get_ajustes();
        let frequencia = 100 - (nro_faltas / ajustes['aulas']) * 100;
        const dados = {
            'rg': data.rg,
            'nome': data.nome,
            'resp': data.resp,
            'tel': data.tel,
            'data_nascimento': formataData({ body: data }),
            'frequencia': frequencia,
            'faltas': nro_faltas,
            'mensalidade': 0,
            'data_cadastro': dia,
            'id_categoria': await get_categoria(data.categoria)
        };

        const alunoExistente = get_alunos_rg(dados.rg);
        if (alunoExistente.length) {
            throw new Error("Aluno já está cadastrado!");
        }

        await salva_dados_alunos(dados, connection);
        await salva_dados_resp(dados, connection);

        await connection.commit();
        return { message: "Aluno cadastrado com sucesso!" };
    } catch (err) {
        if (connection) await connection.rollback();
        throw err;
    } finally {
        if (connection) connection.release();
    }
}

export async function deletaAluno(rg_aluno) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        await deleta_presenca_aluno(rg_aluno, connection);
        await deleta_aluno_historico(rg_aluno, connection);
        await deleta_responsaveis_aluno(rg_aluno, connection);

        const resultado = await deleta_aluno(rg_aluno, connection);

        if (resultado['affectedRows'] === 0) {
            throw new Error("Aluno não encontrado!");
        }

        await connection.commit();
        return { message: "Aluno deletado com sucesso!" };
    } catch (err) {
        if (connection) await connection.rollback();
        throw err;
    } finally {
        if (connection) connection.release();
    }
}

export async function editaAluno(data) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let rgAluno = data.rg;

        const dados = {
            'nome': data.nome_atualizado,
            'data_nascimento': formataData({ body: data }),
            'id_categoria': await get_categoria(data.categoria)
        };

        const resultado = await atualiza_dados_cadastro(dados, rgAluno, connection);

        if (resultado['affectedRows'] === 0) {
            throw new Error("Aluno não encontrado!");
        }

        await atualiza_historico_pagamento(dados['nome'], rgAluno, connection);
        await atualiza_historico_presenca(dados['nome'], rgAluno, connection);

        await connection.commit();
        return { message: "Aluno atualizado com sucesso" };
    } catch (err) {
        if (connection) await connection.rollback();
        throw err;
    } finally {
        if (connection) connection.release();
    }
}

export async function getAllAlunos() {
    return await get_alunos();
}

export async function getAlunosCategoria(categoria) {
    return await retorna_alunos_por_categoria(categoria);
}

export async function getAlunosNome(nome) {
    return await get_rg(nome);
}