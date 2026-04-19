import pool from '../bd/bd.js'

export async function deleta_aluno(rg_aluno, transaction = pool) {
    const [rows] = await transaction.execute('DELETE FROM aluno WHERE rg_aluno=?', [rg_aluno])
    return rows
}

export async function salva_dados_alunos(dados, transaction = pool) {
    const [rows] = await transaction.execute('INSERT INTO aluno (rg_aluno, nome, telefone, data_nascimento, frequencia, faltas, mensalidade, data_cadastro,id_categoria) VALUES (?,?,?,?,?,?,?,?,?)',
        [dados['rg'], dados['nome'], dados['telefone'], dados['data_nascimento'], dados['frequencia'], dados['faltas'], dados['mensalidade'], dados['data_cadastro'], dados["id_categoria"]]
    );
    return rows
}

export async function get_alunos() {
    const [rows] = await pool.query('SELECT * FROM aluno order by rg_aluno asc');
    return rows
}

export async function get_alunos_rg(rg) {
    const [rows] = await pool.execute(`
        SELECT 
            a.*,
            DATE_FORMAT(a.data_nascimento, '%d/%m/%Y') AS data_nascimento,
            r.nome AS nome_responsavel, 
            r.telefone AS telefone_responsavel, 
            r.cpf AS cpf_responsavel, 
            c.nome_categoria
        FROM aluno a
        LEFT JOIN responsaveis r ON a.cpf_responsavel = r.cpf
        LEFT JOIN categorias c ON a.id_categoria = c.id
        WHERE rg_aluno=? order by nome asc`, [rg]);
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
    const [rows] = await transaction.execute('UPDATE aluno SET nome=?, telefone=?, data_nascimento=?, id_categoria=? WHERE rg_aluno=?',
        [dados['nome'], dados['telefone'], dados['data_nascimento'], dados['id_categoria'], rg])
    
    return rows
}

export async function atualiza_mensalidade(dados){
    const[rows] = await pool.execute('UPDATE aluno SET mensalidade=? WHERE rg_aluno=? and mensalidade=0',[dados['mensalidade'],dados['rg']])
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

export async function get_alunos_com_filtros(filtros = {}) {
    let query = `
        SELECT 
            a.*,
            DATE_FORMAT(a.data_nascimento, '%d/%m/%Y') AS data_nascimento,
            r.nome AS nome_responsavel,
            r.telefone AS telefone_responsavel,
            r.cpf AS cpf_responsavel,
            c.nome_categoria
        FROM aluno a 
        LEFT JOIN responsaveis r ON a.cpf_responsavel = r.cpf 
        LEFT JOIN categorias c ON a.id_categoria = c.id
        WHERE 1=1`;
    const params = [];

    if (filtros.id_categoria) {
        query += ' AND a.id_categoria = ?';
        params.push(filtros.id_categoria);
    }

    if (filtros.nome) {
        query += ' AND (a.nome LIKE ? OR r.nome LIKE ?)';
        params.push(`%${filtros.nome}%`, `%${filtros.nome}%`);
    }

    if (filtros.em_dia !== undefined) {
        if (filtros.em_dia === true || filtros.em_dia === 'true') {
            query += ' AND a.mensalidade > 0';
        } else if (filtros.em_dia === false || filtros.em_dia === 'false') {
            query += ' AND a.mensalidade = 0';
        }
    }

    query += ' ORDER BY a.nome ASC';

    const page = parseInt(filtros.page) || 1;
    const limit = parseInt(filtros.limit) || 5;
    const offset = (Math.max(1, page) - 1) * limit;

    query += ' LIMIT ? OFFSET ?;';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);
    return rows;
}

export async function count_alunos_com_filtros(filtros = {}) {
    let query = 'SELECT COUNT(DISTINCT a.rg_aluno) as total FROM aluno a LEFT JOIN responsaveis r ON r.cpf = a.cpf_responsavel WHERE 1=1';
    const params = [];

    if (filtros.id_categoria) {
        query += ' AND a.id_categoria = ?';
        params.push(filtros.id_categoria);
    }

    if (filtros.nome) {
        query += ' AND (a.nome LIKE ? OR r.nome LIKE ?)';
        params.push(`%${filtros.nome}%`, `%${filtros.nome}%`);
    }

    if (filtros.em_dia !== undefined) {
        if (filtros.em_dia === true || filtros.em_dia === 'true') {
            query += ' AND a.mensalidade > 0';
        } else if (filtros.em_dia === false || filtros.em_dia === 'false') {
            query += ' AND a.mensalidade = 0';
        }
    }

    const [result] = await pool.query(query, params);
    return result[0].total;
}