import Router from 'express'
import { deletaAluno } from '../controllers/controllerAluno.js';
import jwtAuth from '../auth/middleware.js';
import authorize from '../auth/authorize.js';

const router = Router()

/*OK*/
router.delete("/deleta_aluno/:rg", jwtAuth, authorize(['ADMIN']), async (req, res) => {
    try{
      await deletaAluno(req.params.rg)
    }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});
export default router;



