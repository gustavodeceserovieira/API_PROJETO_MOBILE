import {virouMes} from '../controllers/controllerMensalidade.js'
import get_ajustes, {login} from '../models/select.js'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
dotenv.config()


export async function fazlogin(req,res) {
    const dadosUsuario = {
        'usuario':req.body.nome.trim(),
        'senha': req.body.password.trim()
    }
    const dadosUsuariobanco = await login();
    const ajustes = await get_ajustes();
    for (const element of dadosUsuariobanco['usuarios']) {
        if(ajustes['qtd'] == 0){
            return
        }
        if(element['nome'] == dadosUsuario['usuario'] && element['senha'] == dadosUsuario['senha']){
            const payload = {
                idUsuario: element.rg_aluno,
                usuario: element.nome,
                role:'USER'
            };
            if(element.nome == 'Administrador'){
                payload.role = 'ADMIN'
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '0.5h' });
            return res.status(201).json({
                mensagem:"Usuário autenticado com sucesso!",
                token:token
            })
        }
    }
    return res.status(401).json({
        mensagem:"Usuário ou senha inválidos"
    })
}

export default fazlogin;