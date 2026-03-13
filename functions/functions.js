import get_ajustes from '../models/select.js'
import { zera_faltas, zera_mensalidade } from '../models/update.js';

export default async function virouMes() {
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

