import pool from "../bd/bd.js";

export async function cria_aula(dados, transaction = pool) {
    const [result] = await transaction.execute(
        'INSERT INTO aulas(data_aula, id_categoria) VALUES (?,?)', 
        [dados.data_aula, dados.id_categoria]
    );

    return result.insertId ?? false;
}