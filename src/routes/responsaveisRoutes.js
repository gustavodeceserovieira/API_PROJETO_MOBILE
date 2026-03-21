import Router from 'express';
import {jwtAuth, authorize} from "../middlewares/authMiddleware.js";
import {editaResponsavel} from "../controllers/controllerResponsaveis.js";
import {validarCampos} from '../middlewares/validacoesMiddleware.js';

const router = Router();

router.patch("/atualiza_dados_responsaveis", jwtAuth, authorize(['ADMIN']), validarCampos(['rg', 'nome_atualizado', 'tel']), editaResponsavel);

export default router;