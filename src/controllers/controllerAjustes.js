import { processaAjustes, consultaAjustes } from '../services/ajustesService.js';

export async function ajustes(req, res) {
    const result = await processaAjustes(req.body);
    return res.status(result.status).json(result.body);
}

export async function getAjustes(req, res) {
    const result = await consultaAjustes();
    return res.status(result.status).json(result.body);
}