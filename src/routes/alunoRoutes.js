import Router from 'express';
import {jwtAuth, authorize} from "../middlewares/authMiddleware.js";
import {cadastraAluno, deletaAluno, editaAluno, getAlunosCategoria, informacoesAlunos, informacaoAluno} from "../controllers/controllerAluno.js";
import {validarCampos} from "../middlewares/validacoesMiddleware.js";
import {getAlunosNome} from "../controllers/controllerAluno.js";


const router = Router();

router.delete("/deleta_aluno/:rg", jwtAuth, authorize(['ADMIN']), deletaAluno);
router.put("/atualiza_dados_aluno/:rg", jwtAuth, authorize(['ADMIN']), validarCampos(['rg']), editaAluno);
router.post("/cria_aluno", jwtAuth, authorize(['ADMIN']), validarCampos([]), cadastraAluno);
router.get("/get_alunos", jwtAuth, authorize(['ADMIN','USER']), informacoesAlunos);
router.get("/alunos_categoria/:id_categoria", jwtAuth, authorize(['ADMIN','USER']), getAlunosCategoria);
router.get("/get_rg_por_nome/:nome", jwtAuth, authorize(['ADMIN','USER']), getAlunosNome);
router.get("/get_aluno_rg/:rg", jwtAuth, authorize(['ADMIN','USER']), informacaoAluno);


export default router;