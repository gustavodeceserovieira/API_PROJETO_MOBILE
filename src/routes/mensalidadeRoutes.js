import Router from 'express';
import {jwtAuth, authorize} from "../middlewares/authMiddleware.js";
import {virouMes} from "../controllers/controllerMensalidade.js";

const router = Router();

router.patch("/zera_mensalidade", jwtAuth, authorize(['ADMIN']), virouMes);

export default router;