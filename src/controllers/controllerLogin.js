import { ativarBiometria, autenticarUsuario, autenticarUsuarioBiometria } from '../services/loginService.js';

export async function fazlogin(req, res) {
    const result = await autenticarUsuario(req.body);
    return res.status(result.status).json(result.body);
}

export async function loginBiometria(req, res) {
    const result = await autenticarUsuarioBiometria(req.body);
    return res.status(result.status).json(result.body);
}

export async function ativarLoginBiometria(req, res) {
    const result = await ativarBiometria(req.body, req.user);
    return res.status(result.status).json(result.body);
}

export default fazlogin;