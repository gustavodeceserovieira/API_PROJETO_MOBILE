import { salvarAjustes as salvarAjustesService } from '../services/ajustesService.js';

export async function salvarAjustes(req, res) {
    try {
        const data = {
            qtdAulas: req.body.qtdAulas,
            valorMensalidade: req.body.valorMensalidade,
            pagamento: req.body.pagamento
        };

        const result = await salvarAjustesService(data);

        return res.status(201).json({
            mensagem: result.message
        });
    } catch (err) {
        return res.status(500).json({
            mensagem: err.message
        });
    }
}