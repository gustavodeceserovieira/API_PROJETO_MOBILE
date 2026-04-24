import cron from 'node-cron';
import pool from '../bd/bd.js';
import { gerar_mensalidade_mes_todos_alunos } from '../models/mensalidadesModel.js';

let activeCrons = {};

export function exibirCronsMensalidadeAgendadas() {
    const crons = Object.entries(activeCrons);

    if (crons.length === 0) {
        console.log('[Cron Mensalidades] Nenhuma cron agendada no momento.');
        return;
    }

    console.log('[Cron Mensalidades] Crons agendadas:');
    crons.forEach(([nome, cronInfo]) => {
        console.log(
            `- ${nome}: schedule="${cronInfo.scheduleStr}", dia=${cronInfo.dia}, valor=${cronInfo.valor}, timezone=${cronInfo.timezone}`
        );
    });
}

export function agendarGeracaoMensalidade(dia, valor) {
    if (activeCrons['mensalidades']) {
        activeCrons['mensalidades'].task.destroy();
    }

    const scheduleStr = `0 0 ${dia} * *`;
    const timezone = 'America/Sao_Paulo';
    const task = cron.schedule(scheduleStr, async () => {
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
        timezone,
    });
    
    activeCrons['mensalidades'] = {
        task,
        scheduleStr,
        dia,
        valor,
        timezone,
    };

    console.log(`Novo cron agendado para todo dia ${dia} com valor R$${valor}`);
}