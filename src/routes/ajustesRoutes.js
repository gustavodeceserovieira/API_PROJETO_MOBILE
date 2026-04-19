import Router from 'express';
import { jwtAuth, authorize } from "../middlewares/authMiddleware.js";
import {ajustes, getAjustes} from "../controllers/controllerAjustes.js";
import {validarCampos} from "../middlewares/validacoesMiddleware.js";

const router = Router();

router.get("/consulta_ajustes", jwtAuth, authorize(['ADMIN']), getAjustes);
router.post("/insere_ajustes", jwtAuth, authorize(['ADMIN']), ajustes);

export default router;