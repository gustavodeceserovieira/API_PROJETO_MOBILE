import { get_ajustes, insere_ajustes, atualiza_ajustes } from '../models/ajustesModel.js';
import { gerarMensalidades } from './mensalidadeService.js';
import pool from '../bd/bd.js';

export async function processaAjustes(body) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const ajustes = await get_ajustes(connection);
        let operacao = 'inseridos';

        if (!ajustes) {
            await insere_ajustes(body, connection);
        } else {
            body.id = ajustes.id;
            await atualiza_ajustes(body, connection);
            operacao = 'atualizados';
        }

        await gerarMensalidades(body, connection);

        await connection.commit();
        return {
            status: 201,
            body: { mensagem: `Ajustes ${operacao} com sucesso!` },
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

export async function consultaAjustes() {
    try {
        const ajustes = await get_ajustes();
        return {
            status: 200,
            body: { ajustes },
        };
    } catch (err) {
        return {
            status: 500,
            body: { mensagem: err.message },
        };
    }
}