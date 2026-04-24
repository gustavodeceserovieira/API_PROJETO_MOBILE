import { listarCategorias } from '../services/categoriasService.js';

export async function getCategorias(req, res) {
    const result = await listarCategorias();
    return res.status(result.status).json(result.body);
}