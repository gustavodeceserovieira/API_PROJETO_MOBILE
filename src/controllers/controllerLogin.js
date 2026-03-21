import { fazLogin as fazLoginService } from '../services/loginService.js';

export async function fazlogin(req, res) {
    try {
        const dadosUsuario = {
            'email': req.body.email,
            'senha': req.body.password
        };

        const result = await fazLoginService(dadosUsuario);

        return res.status(201).json({
            mensagem: result.message,
            token: result.token
        });
    } catch (err) {
        if (err.message === "Acesso bloqueado pelas configurações de ajuste.") {
            return res.status(403).json({
                mensagem: err.message
            });
        }
        if (err.message === "Usuário ou senha inválidos") {
            return res.status(401).json({
                mensagem: err.message
            });
        }
        return res.status(500).json({
            mensagem: err.message
        });
    }
}

export default fazlogin;