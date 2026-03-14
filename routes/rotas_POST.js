import Router from 'express'
import { cria_usuario, insere_ajustes,insere_presenca, salva_dados_alunos, salva_dados_resp } from '../models/insert.js';

const router = Router()

router.post("/salva_alunos", async (req, res) => {
  try{
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
  res.json(aluno)
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});


router.post("/salva_responsavel", async (req, res) => {
  try{
    const dados = {
      "Resp":req.body.resp,
      "Tel": req.body.tel,
      "Rg":req.body.rg_aluno,
      
    }
  const responsavel = await salva_dados_resp(dados)
  res.json(responsavel)
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.post("/cria_usuario", async (req, res) => {
  try{
      const usuario = await cria_usuario(req.body.usuario,req.body.senha)
      res.json(usuario)
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.post("/insere_ajustes", async (req, res) => {
  try{
    const insereAjustes = await insere_ajustes(req.body.qtdAulas, req.body.valorMensalidade, req.body.viradaMes)
    res.json(insereAjustes)
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.post("/insere_historico", async (req, res) => {
  try{
  const dados = {
    'Nome': req.body.nome
  }
  const historico = await insere_historico(req.body.rg,dados,req.body.data)
  res.json(historico)
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.post("/insere_presenca", async (req, res) => {
  try{
    const dados = {
      "Rg":req.body.rg_aluno,
      "Nome":req.body.nome,
      "Data":req.body.data,
    }
  const inserePresenca = await insere_presenca(dados)
  res.json(inserePresenca)
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

export default router;

