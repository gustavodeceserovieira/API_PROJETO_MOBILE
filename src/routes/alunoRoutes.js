import Router from 'express';
import {jwtAuth, authorize} from "../middlewares/authMiddleware.js";
import {cadastraAluno, deletaAluno, editaAluno, getAlunosCategoria, informacoesAlunos} from "../controllers/controllerAluno.js";
import {validarCampos} from "../middlewares/validacoesMiddleware.js";
import {getAlunosNome} from "../controllers/controllerAluno.js";


const router = Router();

router.delete("/deleta_aluno", jwtAuth, authorize(['ADMIN']), validarCampos(['rg']), deletaAluno);
router.patch("/atualiza_dados_aluno", jwtAuth, authorize(['ADMIN']), validarCampos(['rg', 'nome_atualizado', 'data_nascimento', 'categoria']), editaAluno);
router.post("/cria_aluno", jwtAuth, authorize(['ADMIN']), validarCampos(['rg', 'nome', 'resp', 'tel', 'data_nascimento', 'categoria']), cadastraAluno);
router.get("/get_alunos", jwtAuth, authorize(['ADMIN','USER']), informacoesAlunos);
router.get("/alunos_categoria/:id_categoria", jwtAuth, authorize(['ADMIN','USER']), getAlunosCategoria);
router.get("/get_rg_por_nome/:nome", jwtAuth, authorize(['ADMIN','USER']), getAlunosNome);

export default router;