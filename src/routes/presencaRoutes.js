import Router from 'express';
import {jwtAuth, authorize} from "../middlewares/authMiddleware.js";
import {getDatasLancadas, historicoPresenca, registraPresenca, getListaPresenca, getListaPresencaByAluno} from "../controllers/controllerPresenca.js";
import {validarCampos} from '../middlewares/validacoesMiddleware.js';

const router = Router();

router.post("/insere_presenca", jwtAuth, authorize(['ADMIN']), validarCampos([]), registraPresenca);
router.get("/historico_presenca", jwtAuth, authorize(['ADMIN','USER']), historicoPresenca);
router.get("/datas_lancadas", jwtAuth, authorize(['ADMIN','USER']), getDatasLancadas);
router.get("/get_lista_presenca", jwtAuth, authorize(['ADMIN','USER']), getListaPresenca);
router.get("/get_lista_presenca/:rg", jwtAuth, authorize(['ADMIN','USER']), getListaPresencaByAluno);

export default router;