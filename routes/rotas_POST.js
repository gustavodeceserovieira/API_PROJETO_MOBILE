import Router from 'express'
import { salva_dados_alunos } from '../models/insert.js';

const router = Router()
/**
 * @swagger
 * /post_alunos:
 *   post:
 *     summary: Cria um novo aluno
 *     description: Insere um aluno no banco de dados
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rg_aluno:
 *                 type: integer
 *                 example: 191919191919
 *               nome:
 *                 type: string
 *                 example: pix
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 example: 2004-02-10
 *               frequencia:
 *                 type: number
 *                 example: 87.5
 *               faltas:
 *                 type: integer
 *                 example: 4
 *               mensalidade:
 *                 type: integer
 *                 example: 0
 *               data_cadastro:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-03
 *               id_categoria:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Aluno criado com sucesso
 */
router.post("/post_alunos", async (req, res) => {
  const dados = {
    "Rg":req.body.rg_aluno,
    "Nome":req.body.nome,
    "Data_nascimento":req.body.data_nascimento,
    "Frequencia":req.body.frequencia,
    "Faltas":req.body.faltas,
    "Mensalidade":req.body.mensalidade,
    "Data_cadastro":req.body.data_cadastro,
    "Id_categoria":req.body.id_categoria
  }
  const aluno = await salva_dados_alunos(dados)
  res.status(201).json({
    mensagem:"Aluno cadastrado"
  });
});



export default router;

