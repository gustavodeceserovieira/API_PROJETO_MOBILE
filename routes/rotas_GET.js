import Router from 'express'
import { get_alunos } from '../models/select.js';

const router = Router()

/**
 * @swagger
 * /:
 *   get:
 *     summary: Verifica se a API está funcionando
 *     description: Endpoint simples para testar se a API está ativa
 *     responses:
 *       200:
 *         description: API funcionando
 */
router.get("/", (req, res) => {
  res.json("API está funcionando");
});

/**
 * @swagger
 * /get_alunos:
 *   get:
 *     summary: Retorna os alunos no banco de dados do sistema
 *     description:
 *     responses:
 *       200:
 *         description: Usuários no banco de dados
 */
router.get("/get_alunos", async (req, res) => {
  const usuarios = await get_alunos()
  res.json(usuarios);
});


export default router;
