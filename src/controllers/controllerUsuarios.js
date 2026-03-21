import { getUsuarios as getUsuariosService, criaUsuario as criaUsuarioService, deletaUsuario as deletaUsuarioService } from '../services/usuarioService.js';

export async function getUsuarios(req, res){
    try {
        const usuarios = await getUsuariosService();
        return res.status(200).json({
            dados: usuarios
        });
    } catch (err) {
        return res.status(500).json({
            mensagem: err.message
        });
    }
}

export async function criaUsuario(req, res) {
    try {
        const result = await criaUsuarioService(req.body);
        return res.status(201).json({
            mensagem: result.message
        });
    } catch (err) {
        if (err.message === "Usuário já cadastrado") {
            return res.status(409).json({
                mensagem: err.message
            });
        }
        return res.status(500).json({
            mensagem: err.message
        });
    }
}

export async function deletaUsuario(req, res) {
    try {
        const result = await deletaUsuarioService(req.body.email);
        return res.status(200).json({
            mensagem: result.message
        });
    } catch (err) {
        if (err.message === "Usuário não encontrado!") {
            return res.status(404).json({
                mensagem: err.message
            });
        }
        return res.status(500).json({
            mensagem: err.message
        });
    }
}