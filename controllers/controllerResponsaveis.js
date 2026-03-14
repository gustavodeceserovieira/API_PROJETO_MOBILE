import { get_alunos, get_alunos_rg} from "../models/select.js"
import { atualiza_dados_responsaveis } from "../models/update.js"


export async function editaResponsavel(req,res) {
    const dados = {
        'Rg':req.body.rg.split("  ")[0].trim(),
        'Nome': req.body.nome_atualizado.trim(),
        'Tel':req.body.tel.trim(),
    }
    const alunosPorRg = await get_alunos_rg(dados['Rg'])
    for (const alunos of alunosPorRg) {
        await atualiza_dados_responsaveis(dados,alunos['rg_aluno'])
    }
    return res.status(201).json({
        mensagem:"Responsável edita com sucesso!"
    })
}