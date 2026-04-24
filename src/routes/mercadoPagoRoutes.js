import Router from 'express';
import { jwtAuth, authorize } from "../middlewares/authMiddleware.js";
import { criarCobrancaPix, concluirCobranca } from '../controllers/controllerMercadoPago.js';

const router = Router();

router.post("/gerar_cobranca_pix", criarCobrancaPix);
router.post("/concluir_cobranca_pix", concluirCobranca);


export default router;