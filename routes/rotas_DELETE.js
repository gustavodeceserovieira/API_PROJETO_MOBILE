import Router from 'express'
import { deletaAluno } from '../controllers/controllerAluno.js';
import jwtAuth from '../auth/middleware.js';
import authorize from '../auth/authorize.js';
import { deletaUsuario } from '../controllers/controllerUsuarios.js';
const router = Router()


router.delete("/deleta_aluno", jwtAuth, authorize(['ADMIN']),async (req, res) => {
    try{
      await deletaAluno(req.body.rg,req,res)
    }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.delete("/deleta_usuario", jwtAuth, authorize(['ADMIN']), async (req, res) => {
    try{
      await deletaUsuario(req.body.email,req,res)
    }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});


export default router;



