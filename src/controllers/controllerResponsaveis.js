import { obterResponsavelPorCpf } from '../services/responsaveisService.js';

export async function getResponsavel(req,res) {
    const cpfClean = req.params.cpf.replace(/\D/g, '');
    const result = await obterResponsavelPorCpf(cpfClean);
    return res.status(result.status).json(result.body);
}