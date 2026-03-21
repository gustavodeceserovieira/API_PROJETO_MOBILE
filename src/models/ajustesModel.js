import pool from "../bd/bd.js";

export async function insere_ajustes(qtdAulas, valorMensalidade, viradaMes, transaction = pool) {
    const [rows] = await transaction.execute('INSERT INTO ajustes (quantidade_aulas, valor_mensalidade,data_virada_mes) VALUES (?,?,?)', [qtdAulas, valorMensalidade, viradaMes])
    return rows
}

export async function get_ajustes() {
    const [row] = await pool.execute('SELECT * FROM ajustes');
    if (row.length == 0) {
        return {
            'qtd': row.length,
        }
    }
    return {
        'qtd': row.length,
        'aulas': row[0]['quantidade_aulas'],
        'mensalidade': row[0]['valor_mensalidade'],
        'data_virada': row[0]['data_virada_mes'],
    }
}

export async function atualiza_ajustes(qtdAulas, valorMensalidade, viradaMes, transaction = pool) {
    await transaction.execute('SET SQL_SAFE_UPDATES=0')
    const [rows] = await transaction.execute('UPDATE ajustes SET quantidade_aulas=?, valor_mensalidade=?, data_virada_mes=?', [qtdAulas, valorMensalidade, viradaMes])
    await transaction.execute('SET SQL_SAFE_UPDATES=1')
    return rows
}