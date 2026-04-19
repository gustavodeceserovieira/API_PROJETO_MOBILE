import pool from "../bd/bd.js";

export async function retorna_categorias() {
    const [rows] = await pool.execute('SELECT * FROM categorias');
    return rows
}

export async function get_categoria(nome) {
    const [rows] = await pool.execute('SELECT id FROM categorias where nome_categoria=?', [nome]);
    return rows[0]['id']
}