import { retorna_historico_pagamento } from "../models/historicoPagamentoModel.js";

export async function getHistoricoPagamento() {
    return await retorna_historico_pagamento();
}