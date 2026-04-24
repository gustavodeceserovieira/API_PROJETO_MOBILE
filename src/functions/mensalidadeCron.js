import cron from 'node-cron';
import pool from '../bd/bd.js';
import { gerar_mensalidade_mes_todos_alunos } from '../models/mensalidadesModel.js';

let activeCrons = {};

export function agendarGeracaoMensalidade(dia, valor) {
    if (activeCrons['mensalidades']) {
        activeCrons['mensalidades'].destroy();
    }

    const scheduleStr = `0 0 ${dia} * *`;
    
    activeCrons['mensalidades'] = cron.schedule(scheduleStr, async () => {
        try {
            const agora = new Date();

            await gerar_mensalidade_mes_todos_alunos(
                agora.getFullYear(), 
                agora.getMonth() + 1, 
                valor, 
                pool
            );
        } catch (error) {
            console.error('[Cron Error]:', error);
        }
    }, {
        timezone: "America/Sao_Paulo" 
    });

    console.log(`Novo cron agendado para todo dia ${dia} com valor R$${valor}`);
}