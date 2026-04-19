import { listarHistoricoPagamento } from '../services/pagamentoService.js';

export async function HistoricoPagamento(req, res) {
    const result = await listarHistoricoPagamento();
    return res.status(result.status).json(result.body);
}

export default HistoricoPagamento;