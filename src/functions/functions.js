import { get_ajustes } from '../models/ajustesModel.js'
import { zera_faltas, zera_mensalidade } from '../models/alunoModel.js';

export async function virouMes() {
    const dataAtual = new Date().toISOString().split("T")[0];
    const dia = dataAtual.split("-")[2]
    const dataVirada = await get_ajustes()
    const dia_virada = dataVirada['data_virada']
    if(dia == dia_virada){
        await zera_mensalidade()
        await zera_faltas()
        return true
    }   
}

export function formataData(req) {
    const dataFormatada = req.body.data_nascimento
    const [dia, mes, ano] = dataFormatada.split('/')
    return `${ano}-${mes}-${dia}`
}

