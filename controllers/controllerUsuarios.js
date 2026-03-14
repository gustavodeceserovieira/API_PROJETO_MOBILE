import { cria_usuario} from '../models/insert.js';
import { login} from '../models/select.js';
import bcrypt from 'bcrypt'


export async function criaUsuario(req,res) {
    const dadosUsuario = {
        'usuario':req.body.nome,
        'senha':req.body.password
    }
    const HashSenha = await bcrypt.hash(dadosUsuario['senha'],10)
    const dadosUsuariobanco = await login()
    for (const element of dadosUsuariobanco['usuarios']) {
        if(element['nome'] == dadosUsuario['usuario']){
            return res.status(409).json({
                mensagem: "Usuário já cadastrado"
            })
        }
    }
    await cria_usuario(dadosUsuario['usuario'],HashSenha)
    return res.status(201).json({
        mensagem: "Usuário criado com sucesso!"
    })
}
