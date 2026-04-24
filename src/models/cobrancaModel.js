import pool from "../bd/bd.js";

export async function criar_cobranca(dados, transaction = pool) {
    const [rows] = await transaction.execute('INSERT INTO cobranca(id, id_mensalidade, valor, data_expiracao) VALUES(?,?,?,?)', [dados['id'], dados['id_mensalidade'], dados['valor'], dados['data_expiracao']])
    return rows
}

export async function get_cobranca_by_id(id, transaction = pool) {
    const [rows] = await transaction.execute('SELECT * FROM cobranca WHERE id = ?', [id])
    return rows[0];
}

export async function delete_cobrancas_by_mensalidade(id_mensalidade, transaction = pool) {
    const [rows] = await transaction.execute('DELETE FROM cobranca WHERE id_mensalidade = ?', [id_mensalidade])
    return rows
}