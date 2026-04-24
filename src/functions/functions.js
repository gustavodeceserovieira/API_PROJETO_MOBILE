import { get_ajustes } from '../models/ajustesModel.js'
import { zera_mensalidade } from '../models/alunoModel.js';

export async function virouMes() {
    const dataAtual = new Date().toISOString().split("T")[0];
    const dia = dataAtual.split("-")[2]
    const dataVirada = await get_ajustes()
    const dia_virada = dataVirada['data_virada_mes']
    if(dia == dia_virada){
        await zera_mensalidade()
        return true
    }   
}


export async function enviarNotificacao(tokenDestinatario, titulo, mensagem) {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Accept-encoding': 'gzip, deflate',
        },
        body: JSON.stringify({
            to: tokenDestinatario,
            title: titulo,
            body: mensagem,
            sound: 'default',
        }),
    });
    return response;
}

export function zerarHora (data) {
    const d = new Date(data);
    d.setHours(0, 0, 0, 0);
    return d;
};