import Router from 'express';
import {jwtAuth, authorize} from "../middlewares/authMiddleware.js";
import {historicoPresenca, registraPresenca} from "../controllers/controllerPresenca.js";
import {validarCampos} from '../middlewares/validacoesMiddleware.js';

const router = Router();

router.post("/insere_presenca", jwtAuth, authorize(['ADMIN']), validarCampos(['presenca', 'data_presenca', 'categorias']), registraPresenca);
router.get("/historico_presenca", jwtAuth, authorize(['ADMIN','USER']), historicoPresenca);

export default router;