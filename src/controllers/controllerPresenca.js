import { registrarPresencaCategoria, listarHistoricoPresenca, listarDatasLancadas, listarPresencaPorDataECategoria, listarPresencaPorAluno } from '../services/presencaService.js';

export async function registraPresenca(req,res){
    const result = await registrarPresencaCategoria(req.body);
    return res.status(result.status).json(result.body);
}

export async function PresencaCategoria(req,res) {
    return res.status(501).json({ mensagem: 'Não implementado' });
}

export async function historicoPresenca(req,res) {
    const result = await listarHistoricoPresenca();
    return res.status(result.status).json(result.body);
}

export async function getDatasLancadas(req,res) {
    const result = await listarDatasLancadas();
    return res.status(result.status).json(result.body);
}

export async function getListaPresenca(req, res) {
    const { data, id_categoria } = req.query;
    const result = await listarPresencaPorDataECategoria(data, id_categoria);
    return res.status(result.status).json(result.body);
}

export async function getListaPresencaByAluno(req, res) {
    const rg = req.params.rg.replace(/\D/g, '');
    const result = await listarPresencaPorAluno(rg);
    return res.status(result.status).json(result.body);
}