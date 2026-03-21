import pool from "../bd/bd.js";

export async function deleta_responsaveis_aluno(rg_aluno, transaction = pool) {
    const [rows] = await transaction.execute('DELETE FROM responsaveis WHERE rg_aluno=?', [rg_aluno])
    return rows
}

export async function salva_dados_resp(dados, transaction = pool) {
    const [rows] = await transaction.execute('INSERT INTO responsaveis (nome, telefone,rg_aluno) VALUES (?,?,?)', [dados['resp'], dados['tel'], dados['rg']])
    return rows
}

export async function get_responsaveis() {
    const [rows] = await pool.execute('SELECT * FROM responsaveis order by rg_aluno asc');
    return rows
}

export async function get_responsaveis_aluno(rg) {
    const [rows] = await pool.execute('SELECT nome, telefone FROM responsaveis WHERE rg_aluno=? order by rg_aluno asc', [rg]);
    return rows[0]
}

export async function atualiza_dados_responsaveis(dados, rg, transaction = pool) {
    const [rows] = await transaction.execute('UPDATE responsaveis SET nome=?, telefone=? WHERE rg_aluno=?', [dados['nome'], dados['tel'], rg])
    return rows
}