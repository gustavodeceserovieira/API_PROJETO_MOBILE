import { cria_usuario, login, deleta_usuario, get_usuarios } from '../models/usuarioModel.js';
import pool from '../bd/bd.js';
import bcrypt from 'bcrypt';

export async function getUsuarios(req, res){
    try {
        const usuarios = await get_usuarios()
        return res.status(200).json({
            usuarios: usuarios
        })
    } catch (err) {
        return res.status(500).json({
            mensagem: err.message
        })
    }
}

export async function criaUsuario(req, res) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const dadosUsuario = {
            'usuario': req.body.nome,
            'senha': req.body.senha
        }
        const hashSenha = await bcrypt.hash(dadosUsuario['senha'], 10);
        const dadosUsuariobanco = await login();

        for (const element of dadosUsuariobanco['usuarios']) {
            if (element['nome'] == dadosUsuario['usuario']) {
                await connection.rollback();
                return res.status(409).json({
                    mensagem: "Usuário já cadastrado"
                })
            }
        }

        await cria_usuario(dadosUsuario['usuario'], hashSenha, connection);

        await connection.commit();

        return res.status(201).json({
            mensagem: "Usuário criado com sucesso!"
        })
    } catch (err) {
        if (connection) await connection.rollback();
        return res.status(500).json({
            mensagem: err.message
        });
    } finally {
        if (connection) connection.release();
    }
}

export async function deletaUsuario(req, res) {
    const connection = await pool.getConnection()
    try {
        const usuario = req.body.email;

        await connection.beginTransaction()
        const resultado = await deleta_usuario(usuario, connection)

        if (resultado[0].affectedRows === 0) {
            await connection.rollback()
            return res.status(404).json({
                mensagem: "Usuário não encontrado!"
            })
        }

        await connection.commit();

        return res.status(200).json({
            mensagem: "Usuário deletado com sucesso!"
        })
    } catch (err) {
        if (connection) await connection.rollback()
        return res.status(500).json({
            mensagem: err.message
        });
    } finally {
        if (connection) connection.release()
    }
}