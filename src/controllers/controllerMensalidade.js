import { salvarMensalidade as salvarMensalidadeService, virouMes as virouMesService } from '../services/mensalidadeService.js';

export async function salvarMensalidade(req, res) {
    try {
        const data = {
            rg: req.body.rg,
            on: req.body.on,
            data_pagamento: req.body.data_pagamento
        };

        const result = await salvarMensalidadeService(data);
        return res.status(201).json({
            mensagem: result.message
        });
    } catch (err) {
        return res.status(500).json({
            mensagem: err.message
        });
    }
}

export async function virouMes() {
    try {
        return await virouMesService();
    } catch (err) {
        throw err;
    }
}