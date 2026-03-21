import {cria_usuario, login, deleta_usuario, get_usuarios, get_usuario_by_email} from '../models/usuarioModel.js';
import pool from '../bd/bd.js';
import bcrypt from 'bcrypt';

export async function getUsuarios() {
    return await get_usuarios();
}

export async function criaUsuario(dadosUsuario) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { nome, email, senha } = dadosUsuario;
        const usuarioExistente = await get_usuario_by_email(email, connection);

        if (usuarioExistente) {
            throw new Error("Usuário já cadastrado");
        }

        const hashSenha = await bcrypt.hash(senha, 10);

        await cria_usuario(nome, email, hashSenha, connection);

        await connection.commit();
        return { message: "Usuário criado com sucesso!" };

    } catch (err) {
        if (connection) await connection.rollback();
        throw err;
    } finally {
        if (connection) connection.release();
    }
}

export async function deletaUsuario(email) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const resultado = await deleta_usuario(email, connection);

        if (resultado[0].affectedRows === 0) {
            throw new Error("Usuário não encontrado!");
        }

        await connection.commit();

        return { message: "Usuário deletado com sucesso!" };
    } catch (err) {
        if (connection) await connection.rollback();
        throw err;
    } finally {
        if (connection) connection.release();
    }
}