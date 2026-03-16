import Router from 'express'
import { criaUsuario } from '../controllers/controllerUsuarios.js';
import { cadastraAluno } from '../controllers/controllerAluno.js';
import { ajustes } from '../controllers/controllerAjustes.js';
import {Mensalidade} from '../controllers/controllerMensalidade.js';
import { registraPresenca } from '../controllers/controllerPresenca.js';
import fazlogin from '../controllers/controllerLogin.js';
import jwtAuth from '../auth/middleware.js'
import authorize from '../auth/authorize.js'
const router = Router()




router.post("/cria_usuario", jwtAuth, authorize(['ADMIN']), async (req, res) => {
  try{
    await criaUsuario(req,res)
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});


router.post("/cria_aluno", jwtAuth, authorize(['ADMIN']), async (req, res) => {
  try{
    await cadastraAluno(req,res)
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});


router.post("/insere_ajustes",jwtAuth, authorize(['ADMIN']), async (req, res) => {
  try{
    await ajustes(req,res)
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});


router.post("/insere_historico",jwtAuth, authorize(['ADMIN']),  async (req, res) => {
  try{
    await Mensalidade(req,res)
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});


router.post("/insere_presenca", jwtAuth, authorize(['ADMIN']),  async (req, res) => {
  try{
    await registraPresenca(req,res)
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});


router.post("/login", async (req, res) => {
  try{
    await fazlogin(req,res)
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

export default router;






