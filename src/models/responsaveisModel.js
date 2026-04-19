import pool from "../bd/bd.js";

export async function salva_dados_resp(dados, transaction = pool) {
    const [rows] = await transaction.execute('INSERT INTO responsaveis (nome, cpf, telefone) VALUES (?,?,?)', [dados['nome'], dados['cpf'], dados['telefone']])
    return rows
}

export async function get_responsavel_by_cpf(cpf) {
    const [rows] = await pool.execute('SELECT * FROM responsaveis WHERE cpf = ?', [cpf]);
    return rows
}

export async function get_responsaveis() {
    const [rows] = await pool.execute('SELECT * FROM responsaveis ORDER BY nome ASC');
    return rows
}

export async function atualiza_dados_responsaveis(dados, transaction = pool) {
    const [rows] = await transaction.execute('UPDATE responsaveis SET nome=?, telefone=? WHERE cpf=?', [dados['nome'], dados['telefone'], dados['cpf']])
    return rows
}