import { get_ajustes } from '../models/ajustesModel.js';
import { get_alunos_rg, retorna_alunos_por_categoria, atualiza_presenca } from '../models/alunoModel.js';
import { retorna_presenca, insere_presenca } from '../models/presencaModel.js';
import pool from '../bd/bd.js';

export async function registraPresenca(data) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let alunos_ausentes = [];
        const presencas = {};
        for (const key in data.presenca) {
            presencas[key] = data.presenca[key];
        }
        const data_presenca = data.data_presenca.trim();
        const alunosCategoria = await retorna_alunos_por_categoria(data.categorias.trim());

        for (const alunos of alunosCategoria) {
            const presente = alunos['rg_aluno'] in presencas;
            const dados = {
                'nome': alunos['nome'],
                'data': data_presenca,
                'rg': alunos['rg_aluno'],
            };
            if (presente) {
                await insere_presenca(dados, connection);
            } else {
                alunos_ausentes.push(dados);
            }
        }

        for (const alunosAusentes of alunos_ausentes) {
            const rg = alunosAusentes['rg'];
            const getAlunos = await get_alunos_rg(rg);
            const ajustes = await get_ajustes();
            for (const alunos of getAlunos) {
                let nro_faltas = alunos['faltas'];
                let nro_aulas = ajustes['aulas'];
                let faltas_totais = nro_faltas + 1;
                let frequencia = 100 - (faltas_totais / nro_aulas) * 100;
                const dados = {
                    'rg': rg,
                    'frequencia': frequencia,
                    'faltas': faltas_totais,
                };
                await atualiza_presenca(dados, connection);
            }
        }

        await connection.commit();
        return { message: "Presença registrada com sucesso!" };
    } catch (err) {
        if (connection) await connection.rollback();
        throw err;
    } finally {
        if (connection) connection.release();
    }
}

export async function getHistoricoPresenca() {
    return await retorna_presenca();
}