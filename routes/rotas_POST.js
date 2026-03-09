import Router from 'express'
import { salva_dados_alunos } from '../models/insert.js';

const router = Router()

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

