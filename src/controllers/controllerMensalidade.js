import { atualiza_mensalidade, zera_mensalidade, zera_faltas } from "../models/alunoModel.js";
import { insere_historico } from "../models/historicoPagamentoModel.js";
import { get_ajustes } from "../models/ajustesModel.js";
import pool from "../bd/bd.js";

export async function Mensalidade(req, res) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const data = req.body.data_pagamento;
        if (req.body.on) {
            const [rg, ...array] = req.body.rg.split(" ");
            const dados = {
                'rg': rg.trim(),
                'nome': array.join(" ").trim(),
                'mensalidade': 1,
            };
            await atualiza_mensalidade(dados, connection);
            await insere_historico(dados['rg'], dados, data, connection);
        } else {
            const dados = {
                'rg': req.body.rg.split(" ")[0].trim(),
                'mensalidade': 0,
            };
            await atualiza_mensalidade(dados, connection);
        }

        await connection.commit();
        return res.status(201).json({
            mensagem: "Histórico inserido com sucesso!"
        });

    } catch (err) {
        if (connection) await connection.rollback();
        return res.status(500).json({
            mensagem: err.message
        });
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