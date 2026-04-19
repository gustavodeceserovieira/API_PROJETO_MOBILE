import Router from 'express';
import {jwtAuth, authorize} from "../middlewares/authMiddleware.js";
import {getMensalidadesByAluno, setPagoMensalidade, virouMes} from "../controllers/controllerMensalidade.js";
import {validarCampos} from '../middlewares/validacoesMiddleware.js';

const router = Router();

router.patch("/zera_mensalidade", jwtAuth, authorize(['ADMIN']), virouMes);
router.patch("/set_mensalidade_pago", jwtAuth, authorize(['ADMIN']), validarCampos(['id', 'pago']), setPagoMensalidade);
router.get("/get_mensalidades_aluno/:rg_aluno", jwtAuth, authorize(['ADMIN','USER']), getMensalidadesByAluno);


export default router;