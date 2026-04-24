import Router from 'express';
import {jwtAuth, authorize} from "../middlewares/authMiddleware.js";
import {criaUsuario, deletaUsuario, getUsuarios} from "../controllers/controllerUsuarios.js";
import fazlogin, { ativarLoginBiometria, loginBiometria } from "../controllers/controllerLogin.js";
import {validarCampos} from '../middlewares/validacoesMiddleware.js';
import { updateSenha } from '../controllers/controllerUsuarios.js';

const router = Router();

router.delete("/deleta_usuario", jwtAuth, authorize(['ADMIN']), deletaUsuario);
router.post("/cria_usuario", jwtAuth, authorize(['ADMIN']), criaUsuario);
router.post("/login", fazlogin);
router.post("/login_biometria", validarCampos(['tokenBiometria', 'deviceId']), loginBiometria);
router.post("/ativar_login_biometria", jwtAuth, authorize(['USER', 'ADMIN']), validarCampos(['deviceId']), ativarLoginBiometria);
router.get("/get_usuarios", jwtAuth, authorize(['ADMIN']), getUsuarios);
router.post("/salvar_token_usuario", jwtAuth, authorize(['ADMIN']), deletaUsuario)
router.post("/atualizar_senha", jwtAuth, authorize(['USER', 'ADMIN']), validarCampos(['id', 'senhaAtual', 'senhaNova']), updateSenha);

export default router;