import { retorna_historico_pagamento } from '../models/historicoPagamentoModel.js';

export async function listarHistoricoPagamento() {
    try {
        const alunos = await retorna_historico_pagamento();
        return {
            status: 200,
            body: { dados: alunos },
        };
    } catch (err) {
        return {
            status: 500,
            body: { mensagem: err.message },
        };
    }
}
