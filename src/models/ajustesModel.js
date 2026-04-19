import pool from "../bd/bd.js";

export async function insere_ajustes(dados, transaction = pool) {
    const [rows] = await transaction.execute('INSERT INTO ajustes (valor_mensalidade, data_virada_mes, data_inicio_aulas, data_fim_aulas) VALUES (?,?,?,?)', [dados.valor_mensalidade, dados.data_virada_mes, dados.data_inicio_aulas, dados.data_fim_aulas])
    return rows
}

export async function get_ajustes(transaction = pool) {
    const [row] = await transaction.execute('SELECT * FROM ajustes');
    return row[0] || null;
}

export async function atualiza_ajustes(dados, transaction = pool) {
    await transaction.execute('SET SQL_SAFE_UPDATES=0')
    const [rows] = await transaction.execute('UPDATE ajustes SET valor_mensalidade=?, data_virada_mes=?, data_inicio_aulas=?, data_fim_aulas=? WHERE id=?', [dados.valor_mensalidade, dados.data_virada_mes, dados.data_inicio_aulas, dados.data_fim_aulas, dados.id])
    await transaction.execute('SET SQL_SAFE_UPDATES=1')
    return rows
}