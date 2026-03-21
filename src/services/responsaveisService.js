import { get_alunos_rg } from "../models/alunoModel.js";
import { atualiza_dados_responsaveis } from "../models/responsaveisModel.js";
import pool from "../bd/bd.js";

export async function editaResponsavel(data) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const dados = {
            'rg': data.rg.split("  ")[0].trim(),
            'nome': data.nome_atualizado.trim(),
            'tel': data.tel.trim(),
        };

        const alunosPorRg = await get_alunos_rg(dados['rg']);

        for (const alunos of alunosPorRg) {
            await atualiza_dados_responsaveis(dados, alunos['rg_aluno'], connection);
        }

        await connection.commit();
        return { message: "Responsável editado com sucesso!" };
    } catch (err) {
        if (connection) await connection.rollback();
        throw err;
    } finally {
        if (connection) connection.release();
    }
}