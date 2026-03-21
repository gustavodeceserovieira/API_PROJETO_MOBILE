import Router from 'express';
import { jwtAuth, authorize } from "../middlewares/authMiddleware.js";
import {ajustes} from "../controllers/controllerAjustes.js";
import {validarCampos} from "../middlewares/validacoesMiddleware.js";

const router = Router();

router.post("/insere_ajustes", jwtAuth, authorize(['ADMIN']), validarCampos(['qtdAulas', 'valorMensalidade', 'pagamento']), ajustes);

export default router;