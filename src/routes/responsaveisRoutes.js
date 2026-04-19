import Router from 'express';
import {jwtAuth, authorize} from "../middlewares/authMiddleware.js";
import {getResponsavel} from "../controllers/controllerResponsaveis.js";

const router = Router();

router.get("/get_responsavel_cpf/:cpf", jwtAuth, authorize(['ADMIN']), getResponsavel);

export default router;