import { get_ajustes } from '../models/ajustesModel.js';
import {get_usuario_by_email} from '../models/usuarioModel.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

export async function fazLogin(credentials) {
    const ajustes = await get_ajustes();

    if (ajustes['qtd'] === 0) {
        throw new Error("Acesso bloqueado pelas configurações de ajuste.");
    }

    const usuario = await get_usuario_by_email(credentials.email);

    if (usuario && await bcrypt.compare(credentials.senha, usuario.senha)) {
        const payload = {
            idUsuario: usuario.rg_aluno,
            usuario: usuario.nome,
            role: usuario.nome === 'Administrador' ? 'ADMIN' : 'USER'
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30m' });

        return {
            message: "Usuário autenticado com sucesso!",
            token
        };
    }

    throw new Error("Usuário ou senha inválidos");
}