import pool from "../bd/bd.js";

export async function deleta_aluno_historico(rg_aluno, transaction = pool) {
    const [rows] = await transaction.execute('DELETE FROM historico_pagamento WHERE rg_aluno=?', [rg_aluno])
    return rows
}

export async function insere_historico(rg, dados, data, transaction = pool) {
    const [rows] = await transaction.execute('INSERT INTO historico_pagamento(rg_aluno, nome_aluno, data_pagamento) VALUES(?,?,?)', [rg, dados['nome'], data])
    return rows
}

export async function retorna_historico_pagamento() {
    const [rows] = await pool.execute('SELECT * FROM historico_pagamento order by data_pagamento desc');
    return rows
}

export async function atualiza_historico_pagamento(nome, rg_antigo, transaction = pool) {
    const [rows] = await transaction.execute('UPDATE historico_pagamento SET nome_aluno=? WHERE rg_aluno=?', [nome, rg_antigo])
    return rows
}

