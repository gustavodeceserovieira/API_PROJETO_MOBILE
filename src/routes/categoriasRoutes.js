import Router from 'express';
import {jwtAuth, authorize} from "../middlewares/authMiddleware.js";
import { getCategorias } from "../controllers/controllerCategorias.js";

const router = Router();

router.get("/get_categorias", jwtAuth, authorize(['ADMIN']), getCategorias);


export default router;