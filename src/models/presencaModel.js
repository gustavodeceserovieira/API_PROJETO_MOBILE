import pool from '../bd/bd.js'

export async function deleta_presenca_aluno(rg_aluno, transaction = pool) {
    const [rows] = await transaction.execute('DELETE FROM presenca WHERE rg_aluno=?', [rg_aluno])
    return rows
}

export async function insere_presenca(dados, transaction = pool) {
    const [rows] = await transaction.execute('INSERT INTO presenca(nome, data_presenca,rg_aluno) VALUES(?,?,?)', [dados['nome'], dados['data'], dados['rg']])
    return rows
}

export async function retorna_presenca() {
    const [rows] = await pool.execute('SELECT * FROM presenca order by data_presenca desc');
    return rows
}

export async function atualiza_historico_presenca(nome, rg_aluno, transaction = pool) {
    const [rows] = await transaction.execute('UPDATE presenca SET nome=? WHERE rg_aluno=?', [nome, rg_aluno])
    return rows
}