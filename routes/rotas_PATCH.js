import Router from 'express'
import { editaResponsavel } from '../controllers/controllerResponsaveis.js';
import {virouMes} from '../controllers/controllerMensalidade.js';
import { editaAluno } from '../controllers/controllerAluno.js';
import jwtAuth from '../auth/middleware.js';
import authorize from '../auth/authorize.js';

const router = Router()




router.patch("/atualiza_dados_responsaveis", jwtAuth, authorize(['ADMIN']), async (req, res) => {
  try{
    await editaResponsavel(req,res)
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});



router.patch("/zera_mensalidade", jwtAuth, authorize(['ADMIN']), async (req, res) => {
  try{
    await virouMes()
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});



router.patch("/atualiza_dados_aluno", jwtAuth, authorize(['ADMIN']), async (req, res) => {
  try{
    await editaAluno(req,res)
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});


export default router;




