import { gerarCobrancaPix } from "../services/mercadoPagoService.js";
import { concluirCobrancaPix } from "../services/mercadoPagoService.js";

export async function criarCobrancaPix(req, res) {
    const result = await gerarCobrancaPix(req.body);
    return res.status(result.status).json(result.body);
}
 
export async function concluirCobranca(req, res) {
    const result = await concluirCobrancaPix(req.body);
    return res.status(result.status).json(result.body);
}