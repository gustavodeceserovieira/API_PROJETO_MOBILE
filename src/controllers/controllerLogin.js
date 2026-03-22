import { get_ajustes } from '../models/ajustesModel.js';
import { login } from '../models/usuarioModel.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

export async function fazlogin(req, res) {
    try {
        const dadosUsuario = {
            'usuario': req.body.email,
            'senha': req.body.password
        }

        const dadosUsuariobanco = await login();
        const ajustes = await get_ajustes();

        for (const element of dadosUsuariobanco['usuarios']) {
            if (ajustes['qtd'] == 0) {
                return res.status(403).json({
                    mensagem: "Acesso bloqueado pelas configurações de ajuste."
                });
            }

            if (element['nome'] == dadosUsuario['usuario'] && await bcrypt.compare(dadosUsuario['senha'], element['senha'])) {
                const payload = {
                    idUsuario: element.rg_aluno,
                    usuario: element.nome,
                    role: 'USER'
                };

                if (element.nome == 'Administrador') {
                    payload.role = 'ADMIN'
                }
                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '0.5h' });
                return res.status(201).json({
                    mensagem: "Usuário autenticado com sucesso!",
                    token: token
                })
            }
        }

        return res.status(401).json({
            mensagem: "Usuário ou senha inválidos"
        })

    } catch (err) {
        return res.status(500).json({
            mensagem: err.message
        });
    }
}

export default fazlogin;