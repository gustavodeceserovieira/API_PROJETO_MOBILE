import { registraPresenca as registraPresencaService, getHistoricoPresenca as getHistoricoPresencaService } from '../services/presencaService.js';

export async function registraPresenca(req, res) {
    try {
        const data = {
            presenca: req.body.presenca,
            data_presenca: req.body.data_presenca,
            categorias: req.body.categorias
        };

        const result = await registraPresencaService(data);
        return res.status(201).json({
            mensagem: result.message
        });
    } catch (err) {
        return res.status(500).json({
            mensagem: err.message
        });
    }
}

export async function getHistoricoPresenca(req, res) {
    try {
        const alunos = await getHistoricoPresencaService();
        return res.status(200).json({
            data: alunos
        });
    } catch (err) {
        return res.status(500).json({
            mensagem: err.message
        });
    }
}