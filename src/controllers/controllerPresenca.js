import { get_ajustes } from '../models/ajustesModel.js';
import { get_alunos_rg, retorna_alunos_por_categoria, atualiza_presenca } from '../models/alunoModel.js';
import { retorna_categorias } from '../models/categoriasModel.js';
import { retorna_presenca, insere_presenca } from '../models/presencaModel.js';
import pool from '../bd/bd.js';

export async function registraPresenca(req,res){
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let alunos_ausentes = []
        let alunos_presentes = []
        const presencas = {}
        for (const key in req.body.presenca) {
            presencas[key] = req.body.presenca[key];
        }
        const data_presenca = req.body.data_presenca.trim()
        const alunosCategoria = await retorna_alunos_por_categoria(req.body.categorias.trim())

        for (const alunos of alunosCategoria) {
            const presente = alunos['rg_aluno'] in presencas
            const dados = {
                'nome':alunos['nome'],
                'data':data_presenca,
                'rg':alunos['rg_aluno'],
            }
            if (presente) {
                alunos_presentes.push(dados)
                await insere_presenca(dados, connection)
            } else {
                alunos_ausentes.push(dados)
            }
        }

        for (const alunosAusentes of alunos_ausentes) {
            const rg = alunosAusentes['rg']
            const getAlunos = await get_alunos_rg(rg)
            const ajustes = await get_ajustes()
            for (const alunos of getAlunos) {
                let nro_faltas = alunos['faltas']
                let nro_aulas = ajustes['aulas']
                let faltas_totais = nro_faltas + 1
                let frequencia = 100 - (faltas_totais / nro_aulas) * 100
                const dados = {
                    'rg':rg,
                    'frequencia': frequencia,
                    'faltas': faltas_totais,
                }
                await atualiza_presenca(dados, connection)
            }
        }

        await connection.commit();
        return res.status(201).json({
            mensagem:"Presença registrada com sucesso!"
        })

    } catch (err) {
        if (connection) await connection.rollback();
        return res.status(500).json({
            mensagem: err.message
        });
    } finally {
        if (connection) connection.release();
    }
}

export async function PresencaCategoria(req,res) {
    try {
        const categorias = await retorna_categorias()
        return res.status(200).json({
            data:categorias
        })
    } catch (err) {
        return res.status(500).json({
            mensagem: err.message
        });
    }
}

export async function historicoPresenca(req,res) {
    try {
        const alunos = await retorna_presenca()
        return res.status(200).json({
            data:alunos
        })
    } catch (err) {
        return res.status(500).json({
            mensagem: err.message
        });
    }
}