import { processaAjustes, consultaAjustes } from '../services/ajustesService.js';

export async function ajustes(req, res) {
    try {
        const result = await processaAjustes(req.body);
        return res.status(result.status).json(result.body);
    } catch (err) {
        return res.status(500).json({
            mensagem: err.message
        });
    }
}

export async function getAjustes(req, res) {
    try {
        const result = await consultaAjustes();
        return res.status(result.status).json(result.body);
    } catch (err) {
        return res.status(500).json({
            mensagem: err.message
        });
    }
}