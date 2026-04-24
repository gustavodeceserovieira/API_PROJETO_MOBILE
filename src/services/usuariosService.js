import { cria_usuario, login, deleta_usuario, get_usuarios, get_usuario_by_id, atualizar_senha, get_usuario_by_rg } from '../models/usuarioModel.js';
import pool from '../bd/bd.js';
import bcrypt from 'bcrypt';

export async function listarUsuarios() {
    try {
        const usuarios = await get_usuarios();
        return {
            status: 200,
            body: { usuarios: usuarios },
        };
    } catch (err) {
        return {
            status: 500,
            body: { mensagem: err.message },
        };
    }
}

export async function criarUsuario(body) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { nome, senha, rg_aluno } = body;
        const hashSenha = await bcrypt.hash(senha, 10);
        const dadosUsuariobanco = await login();

        for (const element of dadosUsuariobanco['usuarios']) {
            if (element['nome'] == nome) {
                await connection.rollback();
                return {
                    status: 409,
                    body: { mensagem: 'Usuário já cadastrado' },
                };
            }
        }

        await cria_usuario(nome, hashSenha, rg_aluno, connection);
        await connection.commit();

        return {
            status: 201,
            body: { mensagem: 'Usuário criado com sucesso!' },
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

export async function removerUsuario(email) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const resultado = await deleta_usuario(email, connection);

        if (resultado[0].affectedRows === 0) {
            await connection.rollback();
            return {
                status: 404,
                body: { mensagem: 'Usuário não encontrado!' },
            };
        }

        await connection.commit();
        return {
            status: 200,
            body: { mensagem: 'Usuário deletado com sucesso!' },
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

export async function atualizarSenha(body) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { id, senhaAtual, senhaNova } = body;
        const usuario = await get_usuario_by_id(body.id, connection);

        if (!usuario) {
            await connection.rollback();
            return {
                status: 404,
                body: { mensagem: 'Usuário não encontrado!' },
            };
        }

        const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
        if (!senhaValida) {
            await connection.rollback();
            return {
                status: 400,
                body: { mensagem: 'Senha atual incorreta!' },
            };
        }

        const hashSenha = await bcrypt.hash(senhaNova, 10);

        await atualizar_senha(body.id, hashSenha, connection);
        await connection.commit();

        return {
            status: 201,
            body: { mensagem: 'Senha atualizada com sucesso!' },
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

export async function criarOuAtualizarUsuario(dadosAluno, connection = pool) {
    const password = dadosAluno.data_nascimento.split('-').reverse().join('');
    const usuario = await get_usuario_by_rg(dadosAluno.rg, connection);
    const hashSenha = await bcrypt.hash(password, 10);

    if (usuario) {
        await atualizar_senha(usuario.id, hashSenha, connection);
    } else if (!usuario.ultimo_acesso) {
        await cria_usuario(dadosAluno.nome, hashSenha, dadosAluno.rg, connection);
    }
}