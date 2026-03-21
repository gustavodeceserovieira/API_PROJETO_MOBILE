import { atualiza_mensalidade, zera_mensalidade, zera_faltas } from "../models/alunoModel.js";
import { insere_historico } from "../models/historicoPagamentoModel.js";
import { get_ajustes } from "../models/ajustesModel.js";
import pool from "../bd/bd.js";

export async function salvarMensalidade(data) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const data_pagamento = data.data_pagamento;
        if (data.on) {
            const [rg, ...array] = data.rg.split(" ");
            const dados = {
                'rg': rg.trim(),
                'nome': array.join(" ").trim(),
                'mensalidade': 1,
            };
            await atualiza_mensalidade(dados, connection);
            await insere_historico(dados['rg'], dados, data_pagamento, connection);
        } else {
            const dados = {
                'rg': data.rg.split(" ")[0].trim(),
                'mensalidade': 0,
            };
            await atualiza_mensalidade(dados, connection);
        }

        await connection.commit();
        return { message: "Histórico inserido com sucesso!" };
    } catch (err) {
        if (connection) await connection.rollback();
        throw err;
    } finally {
        if (connection) connection.release();
    }
}

export async function virouMes() {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const dataAtual = new Date().toISOString().split("T")[0];
        const dia = dataAtual.split("-")[2];
        const dataVirada = await get_ajustes();
        const dia_virada = dataVirada['data_virada'];

        if (dia == dia_virada) {
            await zera_mensalidade(connection);
            await zera_faltas(connection);
            await connection.commit();
            return true;
        }

        await connection.rollback();
        return false;
    } catch (err) {
        if (connection) await connection.rollback();
        throw err;
    } finally {
        if (connection) connection.release();
    }
}