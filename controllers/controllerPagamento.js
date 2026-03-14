import { retorna_historico_pagamento} from  '../models/select.js'


export async function HistoricoPagamento(req,res) {
    const alunos = await retorna_historico_pagamento()
    return res.status(200).json({
        dados: alunos
    })
    
}

export default HistoricoPagamento;

