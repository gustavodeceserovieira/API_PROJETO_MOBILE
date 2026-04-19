import { autenticarUsuario } from '../services/loginService.js';

export async function fazlogin(req, res) {
    const result = await autenticarUsuario(req.body);
    return res.status(result.status).json(result.body);
}

export default fazlogin;