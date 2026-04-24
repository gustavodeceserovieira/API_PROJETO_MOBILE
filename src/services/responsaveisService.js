import { get_responsavel_by_cpf, salva_dados_resp, atualiza_dados_responsaveis } from '../models/responsaveisModel.js';

export async function obterResponsavelPorCpf(cpf) {
    const result = await get_responsavel_by_cpf(cpf);

    if (result.length === 0) {
        return {
            status: 404,
            body: { mensagem: 'Responsável não encontrado!' },
        };
    }

    return {
        status: 200,
        body: result[0],
    };
}

export async function salvarOuAtualizarResponsavel(dados, transaction) {
    const responsavel = await get_responsavel_by_cpf(dados.cpf);

    if (responsavel.length) {
        await atualiza_dados_responsaveis(dados, transaction);
        return;
    }

    await salva_dados_resp(dados, transaction);
}
