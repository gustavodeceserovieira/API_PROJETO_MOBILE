import Router from 'express'
import { getAlunosCategoria, getAlunosNome, informacoesAlunos } from '../controllers/controllerAluno.js';
import HistoricoPagamento from '../controllers/controllerPagamento.js';
import { historicoPresenca} from '../controllers/controllerPresenca.js';
import {login} from '../models/select.js'
import authorize from '../auth/authorize.js';
import jwtAuth from '../auth/middleware.js';

const router = Router()


router.get("/", (req, res) => {
  res.json("API está funcionando");
});


router.get("/get_alunos", jwtAuth, authorize(['ADMIN','USER']), async (req, res) => {
  try{
    await informacoesAlunos(req,res)
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});


router.get("/get_usuarios", jwtAuth, authorize(['ADMIN','USER']),async (req, res) => {
  try{
    res.status(200).json(await login())

  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});


router.get("/get_rg_por_nome/:nome", jwtAuth, authorize(['ADMIN','USER']), async (req, res) => {
  try{
    await getAlunosNome(req,res)
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});



router.get("/historico_pagamento", jwtAuth, authorize(['ADMIN','USER']), async (req, res) => {
  try{
    await HistoricoPagamento(req,res)
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});


router.get("/historico_presenca", jwtAuth, authorize(['ADMIN','USER']), async (req, res) => {
  try{
    await historicoPresenca(req,res)
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});


router.get("/alunos_categoria/:id_categoria", jwtAuth, authorize(['ADMIN','USER']), async (req, res) => {
  try{
    await getAlunosCategoria(req,res)
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});


export default router;