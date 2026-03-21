import Router from 'express';
import {jwtAuth, authorize} from "../middlewares/authMiddleware.js";
import {salvarMensalidade} from "../controllers/controllerMensalidade.js";
import getHistoricoPagamento from "../controllers/controllerPagamento.js";
import {validarCampos} from '../middlewares/validacoesMiddleware.js';

const router = Router();

router.post("/insere_historico", jwtAuth, authorize(['ADMIN']), validarCampos(['rg', 'data_pagamento', 'on']), salvarMensalidade);
router.get("/historico_pagamento", jwtAuth, authorize(['ADMIN','USER']), getHistoricoPagamento);

export default router;