import pool from '../bd/bd.js'

export async function deleta_aluno(rg_aluno, transaction = pool) {
    const [rows] = await transaction.execute('DELETE FROM aluno WHERE rg_aluno=?', [rg_aluno])
    return rows
}

export async function salva_dados_alunos(dados, transaction = pool) {
    const [rows] = await transaction.execute('INSERT INTO aluno (rg_aluno, nome, data_nascimento, frequencia, faltas, mensalidade, data_cadastro,id_categoria) VALUES (?,?,?,?,?,?,?,?)',
        [dados['rg'], dados['nome'], dados['data_nascimento'], dados['frequencia'], dados['faltas'], dados['salvarMensalidade'], dados['data_cadastro'], dados["id_categoria"]]
    );
    return rows
}

export async function get_alunos() {
    const [rows] = await pool.query('SELECT * FROM aluno order by rg_aluno asc');
    return rows
}

export async function get_alunos_rg(rg) {
    const [rows] = await pool.execute('SELECT * FROM aluno WHERE rg_aluno=? order by nome asc', [rg]);
    return rows
}

export async function get_rg(nome) {
    const [rows] = await pool.execute('SELECT rg_aluno FROM aluno WHERE nome=?', [nome]);
    return rows
}

export async function retorna_alunos_por_categoria(id) {
    const [rows] = await pool.execute('SELECT rg_aluno AS rg, nome FROM aluno WHERE aluno.id_categoria=?', [id]);
    return rows
}

export async function retorna_devedores_por_id(id) {
    const [rows] = await pool.execute('SELECT rg_aluno, nome FROM aluno WHERE aluno.id_categoria=? and mensalidade=0', [id]);
    return rows
}

export async function retorna_devedores() {
    const [rows] = await pool.execute('SELECT * FROM aluno WHERE mensalidade=0 order by aluno.id_categoria');
    return rows
}

export async function retorna_categorias_dos_alunos() {
    const [rows] = await pool.execute('SELECT nome_categoria FROM aluno LEFT JOIN categorias ON aluno.id_categoria = categorias.id order by aluno.rg_aluno asc');
    return rows
}

export async function atualiza_dados_cadastro(dados, rg, transaction = pool) {
    const [rows] = await transaction.execute('UPDATE aluno SET nome=?, data_nascimento=?, id_categoria=? WHERE rg_aluno=?',
        [dados['nome'], dados['data_nascimento'], dados['id_categoria'], rg])
    return rows
}

export async function atualiza_mensalidade(dados){
    const[rows] = await pool.execute('UPDATE aluno SET mensalidade=? WHERE rg_aluno=? and mensalidade=0',[dados['salvarMensalidade'],dados['rg']])
    return rows
}

export async function zera_faltas(transaction = pool) {
    await transaction.execute('SET SQL_SAFE_UPDATES=0')
    const row = await transaction.execute('UPDATE aluno SET faltas=0, frequencia=100 WHERE rg_aluno IS NOT NULL')
    await transaction.execute('SET SQL_SAFE_UPDATES=1')
    return row
}

export async function atualiza_frequencia(dados, transaction = pool) {
    const [rows] = await transaction.execute('UPDATE aluno SET frequencia=? WHERE rg_aluno=?', [dados['frequencia'], dados['rg_aluno']])
    return rows
}

export async function zera_mensalidade(transaction = pool) {
    const [rows] = await transaction.execute('UPDATE aluno SET mensalidade=? WHERE rg_aluno!=?', [0, ' '])
    return rows
}

export async function atualiza_presenca(dados, transaction = pool) {
    const [rows] = await transaction.execute('UPDATE aluno SET frequencia=?, faltas=? WHERE rg_aluno=?', [dados['frequencia'], dados['faltas'], dados['rg']])
    return rows
}



