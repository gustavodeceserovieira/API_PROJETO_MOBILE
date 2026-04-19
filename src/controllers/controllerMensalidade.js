import { registrarMensalidade, executarViradaMes, listarMensalidadesByAluno, atualizarPagoMensalidade } from '../services/mensalidadeService.js';

export async function getMensalidadesByAluno(req, res) {
    const cleanRg = req.params.rg_aluno.replace(/\D/g, '');
    const result = await listarMensalidadesByAluno(cleanRg);
    return res.status(result.status).json(result.body);
}

export async function Mensalidade(req, res) {
    const result = await registrarMensalidade(req.body);
    return res.status(result.status).json(result.body);
}

export async function virouMes(req, res) {
    const result = await executarViradaMes();
    return res.status(result.status).json(result.body);
}

export async function setPagoMensalidade(req, res) {
    const { id, pago } = req.body;
    const result = await atualizarPagoMensalidade(id, pago);
    return res.status(result.status).json(result.body);
}