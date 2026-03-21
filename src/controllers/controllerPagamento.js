import { retorna_historico_pagamento} from "../models/historicoPagamentoModel.js";

export async function HistoricoPagamento(req, res) {
    try {
        const alunos = await retorna_historico_pagamento()
        return res.status(200).json({
            dados: alunos
        })
    } catch (err) {
        return res.status(500).json({
            mensagem: err.message
        })
    }
}

export default HistoricoPagamento;