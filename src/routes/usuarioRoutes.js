import Router from 'express';
import {jwtAuth, authorize} from "../middlewares/authMiddleware.js";
import {criaUsuario, deletaUsuario, getUsuarios} from "../controllers/controllerUsuarios.js";
import fazlogin from "../controllers/controllerLogin.js";
import {validarCampos} from '../middlewares/validacoesMiddleware.js';

const router = Router();

router.delete("/deleta_usuario", jwtAuth, authorize(['ADMIN']), deletaUsuario);
router.post("/cria_usuario", jwtAuth, authorize(['ADMIN']), validarCampos(['nome', 'senha']), criaUsuario);
router.post("/login", validarCampos(['email', 'password']), fazlogin);
router.get("/get_usuarios", jwtAuth, authorize(['ADMIN']), getUsuarios);


export default router;