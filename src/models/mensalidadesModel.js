import pool from '../bd/bd.js'

export async function get_mensalidade_by_id(id, transaction = pool) {
    const [rows] = await transaction.execute(`
        SELECT * FROM mensalidades WHERE id=?
    `, [id])
    return rows[0]
}

export async function get_mensalidades_by_aluno(rg_aluno, transaction = pool) {
    const [rows] = await transaction.execute(`
        SELECT 
            *, 
            FALSE AS pago_via_pix 
        FROM mensalidades WHERE rg_aluno=?
        ORDER BY ano DESC, mes DESC
    `, [rg_aluno])
    return rows
}

export async function atualiza_pago_mensalidade(id, pago, transaction = pool) {
    const [rows] = await transaction.execute(
        'UPDATE mensalidades SET pago = ?, data_pagamento = NOW() WHERE id = ?',
        [pago, id]
    )
    return rows
}


export async function conclui_mensalidade_pix(id, transaction = pool) {
    const currentDate = new Date().toISOString().split('T')[0];
    const [rows] = await transaction.execute(
        'UPDATE mensalidades SET pago = TRUE, pago_via_pix = 1, data_pagamento = NOW() WHERE id = ?',
        [id]
    )
    return rows
}

export async function mensalidade_ja_existe(rg_aluno, ano, mes, transaction = pool) {
    const [rows] = await transaction.execute(
        'SELECT id FROM mensalidades WHERE rg_aluno = ? AND ano = ? AND mes = ? LIMIT 1',
        [rg_aluno, ano, mes]
    )
    return rows.length > 0
}

export async function insere_mensalidade(dados, transaction = pool) {
    const [rows] = await transaction.execute(
        'INSERT INTO mensalidades (rg_aluno, valor, ano, mes, pago) VALUES (?, ?, ?, ?, 0)',
        [dados.rg_aluno, dados.valor, dados.ano, dados.mes]
    )
    return rows
}

export async function get_mensalidades_filtradas(mes, ano, transaction = pool) {
    let query = `
        SELECT
            m.*,
            a.nome AS nome_aluno,
            aj.data_inicio_aulas,
            aj.data_fim_aulas
        FROM mensalidades m
        LEFT JOIN aluno a ON m.rg_aluno = a.rg_aluno
        LEFT JOIN (
            SELECT data_inicio_aulas, data_fim_aulas
            FROM ajustes
            ORDER BY id DESC
            LIMIT 1
        ) aj ON 1=1
        WHERE 1=1`;
    const params = [];

    if (mes) {
        query += ' AND mes = ?';
        params.push(mes);
    }

    if (ano) {
        query += ' AND ano = ?';
        params.push(ano);
    }

    query += ' ORDER BY ano DESC, mes DESC';

    const [rows] = await transaction.execute(query, params);
    return rows;
}

export async function delete_mensalidades_fora_periodo(data_inicial, data_final, transaction = pool) {
    const query = `
        DELETE FROM mensalidades 
        WHERE pago != 1 AND
            (
                STR_TO_DATE(CONCAT(ano, '-', mes, '-01'), '%Y-%m-%d') < DATE_FORMAT(?, '%Y-%m-01')
                OR STR_TO_DATE(CONCAT(ano, '-', mes, '-01'), '%Y-%m-%d') > LAST_DAY(?)
            )
    `;

    const [rows] = await transaction.execute(query, [data_inicial, data_final]);
    return rows;
}

export async function delete_mensalidades_futuras(transaction = pool) {
    const query = `
        DELETE FROM mensalidades 
        WHERE id > 0 AND STR_TO_DATE(CONCAT(ano, '-', mes, '-01'), '%Y-%m-%d') > LAST_DAY(NOW());
    `;

    const [result] = await transaction.execute(query);
    return result;
}

export async function gerar_mensalidades_retroativas(data_inicial, data_final, valor, transaction = pool) {
    const query = `
        INSERT IGNORE INTO mensalidades (rg_aluno, valor, ano, mes, pago)
        WITH RECURSIVE meses_sequencia AS (
            SELECT CAST(? AS DATE) AS data_inicial
            
            UNION ALL
            
            SELECT data_inicial + INTERVAL 1 MONTH
            FROM meses_sequencia
            WHERE data_inicial + INTERVAL 1 MONTH <= LAST_DAY(?)
        ),
        meses AS (
            SELECT 
                YEAR(data_inicial) AS ano,
                MONTH(data_inicial) AS mes
            FROM meses_sequencia
        ),
        alunos AS (
            SELECT rg_aluno FROM aluno
        )
        SELECT 
            a.rg_aluno, 
            ? AS valor,
            m.ano, 
            m.mes,
            0 AS pago
        FROM alunos a
        CROSS JOIN meses m
        ORDER BY a.rg_aluno, m.ano, m.mes;
    `;

    const [result] = await transaction.execute(query, [data_inicial, data_final, valor]);
    return result;
}

export async function gerar_mensalidade_mes_todos_alunos(ano, mes, valor, transaction = pool) {
    const query = `
        INSERT IGNORE INTO mensalidades (rg_aluno, valor, ano, mes, pago)
        SELECT 
            rg_aluno, 
            ? AS valor,
            ? AS ano, 
            ? AS mes,
            0 AS pago
        FROM aluno
    `;
    
    const [result] = await transaction.execute(query, [valor, ano, mes]);
    return result;
}