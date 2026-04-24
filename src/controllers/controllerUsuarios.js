import { listarUsuarios, criarUsuario, removerUsuario, atualizarSenha } from '../services/usuariosService.js';

export async function getUsuarios(req, res){
    const result = await listarUsuarios();
    return res.status(result.status).json(result.body);
}

export async function criaUsuario(req, res) {
    const result = await criarUsuario(req.body);
    return res.status(result.status).json(result.body);
}

export async function deletaUsuario(req, res) {
    const result = await removerUsuario(req.body.email);
    return res.status(result.status).json(result.body);
}

export async function updateSenha(req, res) {
    const result = await atualizarSenha(req.body);
    return res.status(result.status).json(result.body);
}

