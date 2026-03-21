import { getHistoricoPagamento as getHistoricoPagamentoService } from '../services/pagamentoService.js';

export async function getHistoricoPagamento(req, res) {
    try {
        const result = await getHistoricoPagamentoService();
        return res.status(200).json({
            dados: result
        });
    } catch (err) {
        return res.status(500).json({
            mensagem: err.message
        });
    }
}

export default getHistoricoPagamento;