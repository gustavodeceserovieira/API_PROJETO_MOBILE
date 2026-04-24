import pool from '../bd/bd.js'

export async function deleta_presenca_aluno(rg_aluno, transaction = pool) {
    const [rows] = await transaction.execute('DELETE FROM presenca WHERE rg_aluno=?', [rg_aluno])
    return rows
}

export async function delete_usuario_aluno(rg_aluno, transaction = pool) {
    const [rows] = await transaction.execute('DELETE FROM usuario WHERE rg_aluno=?', [rg_aluno])
    return rows
}

export async function deleta_mensalidades_aluno(rg_aluno, transaction = pool) {
    const [rows] = await transaction.execute('DELETE FROM mensalidades WHERE rg_aluno=?', [rg_aluno])
    return rows
}

export async function deleta_presenca_data(data_presenca, transaction = pool) {
    const [rows] = await transaction.execute('DELETE FROM presenca WHERE data_presenca=?', [data_presenca])
    return rows
}

export async function get_datas_lancadas(transaction = pool) {
    const [rows] = await transaction.execute(
        "SELECT DISTINCT DATE_FORMAT(data_presenca, '%Y-%m-%d') AS data_presenca FROM presenca ORDER BY data_presenca ASC"
    )
    return rows
}

export async function insere_presenca(dados, transaction = pool) {
    const [rows] = await transaction.execute('INSERT INTO presenca(data_presenca ,rg_aluno, presente, id_categoria) VALUES(?,?,?,?)', [dados['data_presenca'], dados['rg_aluno'], dados['presente'], dados['id_categoria']])
    return rows
}

export async function retorna_presenca() {
    const [rows] = await pool.execute('SELECT * FROM presenca order by data_presenca desc');
    return rows
}

export async function get_presenca_by_aluno(rg_aluno, transaction = pool) {
    const [rows] = await transaction.execute('SELECT * FROM presenca WHERE rg_aluno=?', [rg_aluno])
    return rows
}

export async function get_lista_presenca(data_presenca, id_categoria, transaction = pool) {
    const [rows] = await transaction.execute(
        `SELECT 
            a.rg_aluno,
            a.nome AS nome_aluno, 
            c.nome_categoria,
            p.presente 
        FROM aluno a 
        LEFT JOIN categorias c ON c.id = a.id_categoria
        LEFT JOIN presenca p ON p.rg_aluno = a.rg_aluno AND p.id_categoria = c.id AND DATE_FORMAT(p.data_presenca, '%Y-%m-%d') = ?
        WHERE a.id_categoria = ?
        ORDER BY a.nome ASC`,
        [data_presenca, id_categoria]
    )
    return rows
}