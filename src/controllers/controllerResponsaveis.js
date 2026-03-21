import { get_alunos_rg } from "../models/alunoModel.js"
import { atualiza_dados_responsaveis } from "../models/responsaveisModel.js"
import pool from "../bd/bd.js"

export async function editaResponsavel(req, res) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const dados = {
            'rg': req.body.rg.split("  ")[0].trim(),
            'nome': req.body.nome_atualizado.trim(),
            'tel': req.body.tel.trim(),
        }

        const alunosPorRg = await get_alunos_rg(dados['rg'])

        for (const alunos of alunosPorRg) {
            await atualiza_dados_responsaveis(dados, alunos['rg_aluno'], connection)
        }

        await connection.commit();
        return res.status(201).json({
            mensagem: "Responsável editado com sucesso!"
        })

    } catch (err) {
        if (connection) await connection.rollback();
        return res.status(500).json({
            mensagem: err.message
        });
    } finally {
        if (connection) connection.release();
    }
}