import get_ajustes, { get_alunos } from '../models/select.js'
import { atualiza_ajustes,atualiza_frequencia } from '../models/update.js';
import { insere_ajustes } from '../models/insert.js';




export async function ajustes(req,res){
    let qtdaulas = parseInt(req.body.qtdAulas.trim())
    let mensalidade = parseFloat(req.body.valorMensalidade.replace(",",".").trim())
    let viradaMes = req.body.pagamento.trim()
    const ajustes = await get_ajustes()
    const dadosBanco = await get_alunos()
    if(ajustes['qtd'] == 0){
        await insere_ajustes(qtdaulas,mensalidade,viradaMes)
    }else{
        await atualiza_ajustes(qtdaulas,mensalidade,viradaMes)
    for (const usuarios of dadosBanco) {
        let nro_faltas = usuarios['faltas']
        let frequencia  = 100 - (nro_faltas / qtdaulas) * 100
        let rg_aluno = usuarios['rg_aluno']
        const dados = {
        'rg_aluno':rg_aluno,
        'frequencia':frequencia
        }
        await atualiza_frequencia(dados)
    }
    res.status(201).json({
      mensagem:"Ajustes inseridos com sucesso!"
    })
    }
}


