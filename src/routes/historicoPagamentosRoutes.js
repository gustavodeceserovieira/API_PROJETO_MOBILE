import Router from 'express';
import {jwtAuth, authorize} from "../middlewares/authMiddleware.js";
import {Mensalidade} from "../controllers/controllerMensalidade.js";
import HistoricoPagamento from "../controllers/controllerPagamento.js";
import {validarCampos} from '../middlewares/validacoesMiddleware.js';

const router = Router();

router.post("/insere_historico", jwtAuth, authorize(['ADMIN']), validarCampos(['rg', 'data_pagamento', 'on']), Mensalidade);
router.get("/historico_pagamento", jwtAuth, authorize(['ADMIN','USER']), HistoricoPagamento);

export default router;