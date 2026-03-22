import { get_alunos, retorna_categorias_dos_alunos, get_rg, retorna_alunos_por_categoria, salva_dados_alunos, atualiza_dados_cadastro, deleta_aluno } from '../models/alunoModel.js';
import { get_ajustes } from '../models/ajustesModel.js';
import { retorna_categorias, get_categoria } from '../models/categoriasModel.js';
import { deleta_aluno_historico, atualiza_historico_pagamento } from '../models/historicoPagamentoModel.js';
import { deleta_presenca_aluno, atualiza_historico_presenca } from '../models/presencaModel.js';
import { salva_dados_resp, deleta_responsaveis_aluno, get_responsaveis } from '../models/responsaveisModel.js';
import pool from '../bd/bd.js';
import { formataData } from '../functions/functions.js'

export async function informacoesAlunos(req,res) {
    const alunos = await get_alunos();
    const responsaveis = await get_responsaveis()
    const categorias = await retorna_categorias_dos_alunos();
    if(alunos.length === 0){
        return res.status(404).json({
            mensagem:"Aluno não encontrado!"
        })
    }
    const data = alunos.map((aluno, i) => ({
        aluno: aluno,
        responsavel_aluno: responsaveis[i] || null,
        categoria_aluno: categorias[i] || null
    }));
    return res.status(200).json({
        alunos:data
    })
    
}

export async function cadastraAluno(req, res) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const dia = new Date()
        const nro_faltas = 0;
        const ajustes = await get_ajustes()
        let frequencia = 100 - (nro_faltas / ajustes['aulas']) * 100
        const dados = {
            'rg': req.body.rg,
            'nome': req.body.nome,
            'resp': req.body.resp,
            'tel': req.body.tel,
            'data_nascimento': formataData(req),
            'frequencia': frequencia,
            'faltas': nro_faltas,
            'mensalidade': 0,
            'data_cadastro': dia,
            'id_categoria': await get_categoria(req.body.categoria)
        }

        const dadosBanco = await get_alunos()
        await retorna_categorias()

        for (const alunos of dadosBanco) {
            if (alunos['rg_aluno'] == req.body.rg) {
                await connection.rollback();
                return res.status(409).json({
                    mensagem: "Aluno já está cadastrado!"
                })
            }
        }

        await salva_dados_alunos(dados, connection)
        await salva_dados_resp(dados, connection)

        await connection.commit();
        return res.status(201).json({
            mensagem: "Aluno cadastrado com sucesso!"
        })
    } catch (err) {
        if (connection) await connection.rollback();
        return res.status(500).json({ mensagem: err.message });
    } finally {
        if (connection) connection.release();
    }
}

export async function deletaAluno(req, res) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const rg_aluno = req.body.rg;

        await deleta_presenca_aluno(rg_aluno, connection);
        await deleta_aluno_historico(rg_aluno, connection);
        await deleta_responsaveis_aluno(rg_aluno, connection);

        const resultado = await deleta_aluno(rg_aluno, connection);

        if (resultado['affectedRows'] === 0) {
            await connection.rollback();
            return res.status(404).json({
                mensagem: "Aluno não encontrado!"
            });
        }

        await connection.commit();
        return res.status(200).json({
            mensagem: "Aluno deletado com sucesso!"
        });
    } catch (err) {
        if (connection) await connection.rollback();
        return res.status(500).json({
            mensagem: err.message
        });
    } finally {
        if (connection) connection.release();
    }
}

export async function editaAluno(req, res) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let rgAluno = req.body.rg;

        const dados = {
            'nome': req.body.nome_atualizado,
            'data_nascimento': formataData(req),
            'id_categoria': await get_categoria(req.body.categoria)
        }

        const resultado = await atualiza_dados_cadastro(dados, rgAluno, connection)

        if (resultado['affectedRows'] === 0) {
            await connection.rollback();
            return res.status(404).json({
                mensagem: "Aluno não encontrado!"
            })
        }

        await atualiza_historico_pagamento(dados['nome'], rgAluno, connection)
        await atualiza_historico_presenca(dados['nome'], rgAluno, connection)

        await connection.commit();
        return res.status(201).json({
            mensagem: "Aluno atualizado com sucesso"
        })
    } catch (err) {
        if (connection) await connection.rollback();
        return res.status(500).json({ mensagem: err.message });
    } finally {
        if (connection) connection.release();
    }
}

export async function getAlunosCategoria(req, res) {
    try {
        const categoria = req.params.id_categoria
        const alunos = await retorna_alunos_por_categoria(categoria)
        res.status(200).json({ alunos: alunos });
    } catch (err) {
        res.status(500).json({ mensagem: err.message });
    }
}

export async function getAlunosNome(req, res) {
    try {
        const nome = req.params.nome
        const alunos = await get_rg(nome)
        res.status(200).json({ alunos: alunos })
    } catch (err) {
        res.status(500).json({ mensagem: err.message });
    }
}