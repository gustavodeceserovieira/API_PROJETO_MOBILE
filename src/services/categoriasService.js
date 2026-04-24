import { retorna_categorias } from '../models/categoriasModel.js';

export async function listarCategorias() {
    try {
        const categorias = await retorna_categorias();
        return {
            status: 200,
            body: { data: categorias },
        };
    } catch (err) {
        return {
            status: 500,
            body: { mensagem: err.message },
        };
    }
}
