import { get_ajustes, insere_ajustes, atualiza_ajustes } from '../models/ajustesModel.js';
import { get_alunos, atualiza_frequencia } from '../models/alunoModel.js';
import pool from '../bd/bd.js';

export async function ajustes(req, res) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        let qtdaulas = parseInt(req.body.qtdAulas.trim())
        let mensalidade = parseFloat(req.body.valorMensalidade.replace(",", ".").trim())
        let viradaMes = req.body.pagamento.trim()

        const ajustes = await get_ajustes()
        const dadosBanco = await get_alunos()

        if (ajustes['qtd'] == 0) {
            await insere_ajustes(qtdaulas, mensalidade, viradaMes, connection)
        } else {
            await atualiza_ajustes(qtdaulas, mensalidade, viradaMes, connection)

            for (const usuarios of dadosBanco) {
                let nro_faltas = usuarios['faltas']
                let frequencia = 100 - (nro_faltas / qtdaulas) * 100
                let rg_aluno = usuarios['rg_aluno']
                const dados = {
                    'rg_aluno': rg_aluno,
                    'frequencia': frequencia
                }
                await atualiza_frequencia(dados, connection)
            }
        }

        await connection.commit();
        return res.status(201).json({
            mensagem: "Ajustes inseridos com sucesso!"
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