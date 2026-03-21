import { editaResponsavel as editaResponsavelService } from '../services/responsaveisService.js';

export async function editaResponsavel(req, res) {
    try {
        const data = {
            rg: req.body.rg,
            nome_atualizado: req.body.nome_atualizado,
            tel: req.body.tel
        };

        const result = await editaResponsavelService(data);
        return res.status(201).json({
            mensagem: result.message
        });
    } catch (err) {
        return res.status(500).json({
            mensagem: err.message
        });
    }
}