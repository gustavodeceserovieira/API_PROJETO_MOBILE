import Router from 'express'
import { deleta_aluno, deleta_aluno_historico, deleta_presenca_aluno, deleta_responsaveis_aluno } from '../models/delete.js';

const router = Router()


router.delete("/deleta_aluno_historico", async (req, res) => {
    try{
        const aluno = await deleta_aluno_historico(req.body.rg_aluno)
        res.json(aluno);
    }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
 
});

router.delete("/deleta_aluno", async (req, res) => {
    try{
        const aluno = await deleta_aluno(req.body.rg_aluno)
        res.json(aluno);
    }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.delete("/deleta_responsaveis_aluno", async (req, res) => {
    try{
        const responsaveis = await deleta_responsaveis_aluno(req.body.rg_aluno)
        res.json(responsaveis);
    }catch(err){
      res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
 
});

router.delete("/deleta_presenca_aluno", async (req, res) => {
    try{
        const presenca = await deleta_presenca_aluno(req.body.rg_aluno)
        res.json(presenca);
    }catch(err){
      res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

export default router;
