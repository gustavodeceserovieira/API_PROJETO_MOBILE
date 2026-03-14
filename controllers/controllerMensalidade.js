import { atualiza_mensalidade } from "../models/update.js"
import { insere_historico} from "../models/insert.js"
import { zera_mensalidade, zera_faltas } from "../models/update.js"

import get_ajustes from "../models/select.js"


export async function Mensalidade(req,res) {
    const data = req.body.data_pagamento
    if(req.body.on){
        const [rg, ...array] = req.body.rg.split(" ");
        const dados = {
            'Rg': rg.trim(),
            'Nome': array.join(" ").trim(),
            'Mensalidade': 1,
        }
        await atualiza_mensalidade(dados)
        await insere_historico(dados['Rg'],dados,data)
    }else{
        const dados = {
            'Rg': req.body.rg.split(" ")[0].trim(),
            'Mensalidade':0,
        }
        await atualiza_mensalidade(dados)
    }
    return res.status(201).json({
      mensagem:"Histórico inserido com sucesso!"
    })
}

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

