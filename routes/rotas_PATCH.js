import Router from 'express'
import { atualiza_ajustes, atualiza_dados, atualiza_dados_responsaveis, atualiza_frequencia, atualiza_historico_pagamento, atualiza_historico_presenca, atualiza_mensalidade, atualiza_presenca, zera_faltas, zera_mensalidade } from '../models/update.js';

const router = Router()



router.patch("/atualiza_dados", async (req, res) => {

  try{
    const dados = {
        'Nome':req.body.nome,
        'Data_nascimento': req.body.data_nascimento,
        'Id_categoria':req.body.id_categoria,
    }
    const rg = req.body.rg
    const atualizaDados = await atualiza_dados(dados,rg)
    res.json(atualizaDados);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});


router.patch("/zera_faltas", async (req, res) => {
  try{
    const faltas = await zera_faltas()
    res.json(faltas);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.patch("/atualiza_dados_responsaveis", async (req, res) => {
  try{
    const dados = {
        'Nome':req.body.nome,
        'Tel': req.body.data_nascimento,
    }
    const rgResp = req.body.rg
    const dadosResponsaveis = await atualiza_dados_responsaveis(dados,rgResp)
    res.json(dadosResponsaveis);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.patch("/atualiza_mensalidade", async (req, res) => {
  try{
    const dados = {
        'Mensalidade':req.body.mensalidade,
        'Rg': req.body.rg_aluno,
    }
    const mensalidade = await atualiza_mensalidade(dados)
    res.json(mensalidade);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.patch("/atualiza_ajustes", async (req, res) => {
  try{
    const ajustes = await atualiza_ajustes(req.body.qtdAulas, req.body.valorMensalidade, req.body.viradaMes)
    res.json(ajustes);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.patch("/atualiza_frequencia", async (req, res) => {
  try{
    const dados = {
        'frequencia':req.body.frequencia,
        'rg_aluno':req.body.rg_aluno
    }
    const frequencia = await atualiza_frequencia(dados)
    res.json(frequencia);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.patch("/zera_mensalidade", async (req, res) => {
  try{
    const zeraMensalidade = await zera_mensalidade()
    res.json(zeraMensalidade);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.patch("/atualiza_presenca", async (req, res) => {
  try{
    const dados = {
        'Frequencia': req.body.frequencia,
        'Faltas': req.body.faltas,
        'Rg': req.body.rg_aluno

    }
    const presenca = await atualiza_presenca(dados)
    res.json(presenca);
  }catch{
    res.json({
      mensagem: `Erro ${res.statusCode}`
    })
  }
});

router.patch("/atualiza_historico_pagamento", async (req, res) => {
  try{
    const historico_pagamento = await atualiza_historico_pagamento(req.body.nome,req.body.nomeAntigo)
    res.json(historico_pagamento);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.patch("/atualiza_historico_presenca", async (req, res) => {
  try{
    const historico_presenca = await atualiza_historico_presenca(req.body.nome,req.body.rgAntigo)
    res.json(historico_presenca);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

export default router;
