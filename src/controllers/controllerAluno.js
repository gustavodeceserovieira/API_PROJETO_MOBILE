import { listarInformacoesAlunos, listarAlunoPorRg, salvarOuAtualizarAluno, removerAluno, listarAlunosPorCategoria, listarRgPorNome } from '../services/alunoService.js';

export async function informacoesAlunos(req, res) {
    const filtros = {
        id_categoria: req.query.id_categoria,
        nome: req.query.nome,
        em_dia: req.query.em_dia,
        page: req.query.page,
        limit: req.query.limit,
    };
    const result = await listarInformacoesAlunos(filtros);
    return res.status(result.status).json(result.body);
}

export async function informacaoAluno(req, res) {
    const cleanRg = req.params.rg.replace(/\D/g, '');
    const result = await listarAlunoPorRg(cleanRg);
    return res.status(result.status).json(result.body);
}

export async function cadastraAluno(req, res) {
    const result = await salvarOuAtualizarAluno(req.body);
    return res.status(result.status).json(result.body);
}

export async function deletaAluno(req, res) {
    const cleanRg = req.params.rg.replace(/\D/g, '');
    const result = await removerAluno(cleanRg);
    return res.status(result.status).json(result.body);
}

export async function editaAluno(req, res) {
    const cleanRg = req.params.rg.replace(/\D/g, '');
    const result = await salvarOuAtualizarAluno(req.body, cleanRg);
    return res.status(result.status).json(result.body);
}

export async function getAlunosCategoria(req, res) {
    const result = await listarAlunosPorCategoria(req.params.id_categoria);
    return res.status(result.status).json(result.body);
}

export async function getAlunosNome(req, res) {
    const result = await listarRgPorNome(req.params.nome);
    return res.status(result.status).json(result.body);
}