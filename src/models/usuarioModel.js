import pool from "../bd/bd.js";

export async function deleta_usuario(usuario, transaction = pool) {
    await transaction.execute('SET SQL_SAFE_UPDATES=0')
    const row = await transaction.execute('DELETE FROM usuario WHERE nome=?', [usuario])
    await transaction.execute('SET SQL_SAFE_UPDATES=1')
    return row
}

export async function cria_usuario(usuario, senha, rg_aluno, transaction = pool) {
    const [rows] = await transaction.execute('INSERT INTO usuario(nome,senha,rg_aluno) VALUES(?, ?, ?)', [usuario, senha, rg_aluno]);
    return rows
}

export async function atualizar_senha(id, senha, transaction = pool) {
    await transaction.execute('UPDATE usuario SET senha=? WHERE id=?', [senha, id]);
}

export async function atualizar_nome_senha(id, nome, senha, transaction = pool) {
    await transaction.execute('UPDATE usuario SET nome=?, senha=? WHERE id=?', [nome, senha, id]);
}

export async function atualizar_nome(id, nome, transaction = pool) {
    await transaction.execute('UPDATE usuario SET nome=? WHERE id=?', [nome, id]);
}

export async function login() {
    const [rows] = await pool.execute('SELECT * FROM usuario');
    return {
        'quantidade': rows.length,
        'usuarios': rows
    }

}

export async function get_usuarios(transaction = pool) {
    const [rows] = await transaction.execute("SELECT nome FROM usuario where nome !='Administrador'");
    return rows;
}

export async function salvar_expo_token_usuario(token, id_usuario, transaction = pool) {
    await transaction.execute('UPDATE usuario SET expo_token=?, ultimo_acesso=NOW() WHERE id=?', [token, id_usuario]);
}

export async function get_administrador(transaction = pool) {
    const [rows] = await transaction.execute("SELECT * FROM usuario WHERE nome = 'Administrador'");
    return rows[0];
}

export async function get_usuario_by_id(id, transaction = pool) {
    const [rows] = await transaction.execute("SELECT * FROM usuario WHERE id = ?", [id]);
    return rows[0];
}

export async function get_usuario_by_rg(rg_aluno, transaction = pool) {
    const [rows] = await transaction.execute("SELECT * FROM usuario WHERE rg_aluno = ?", [rg_aluno]);
    return rows[0];
}