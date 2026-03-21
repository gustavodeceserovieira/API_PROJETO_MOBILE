import pool from "../bd/bd.js";

export async function deleta_usuario(usuario, transaction = pool) {
    await transaction.execute('SET SQL_SAFE_UPDATES=0')
    const row = await transaction.execute('DELETE FROM usuario WHERE nome=?', [usuario])
    await transaction.execute('SET SQL_SAFE_UPDATES=1')
    return row
}

export async function cria_usuario(usuario, senha, transaction = pool) {
    const [rows] = await transaction.execute('INSERT INTO usuario(nome,senha) VALUES(?,?)', [usuario, senha]);
    return rows
}

export async function login() {
    const [rows] = await pool.execute('SELECT * FROM usuario');
    return {
        'quantidade': rows.length,
        'usuarios': rows
    }

}

export async function get_usuarios() {
    const [rows] = await pool.execute('SELECT nome FROM usuario');
    return rows;
}