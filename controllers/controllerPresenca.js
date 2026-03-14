import get_ajustes, {get_alunos_rg, retorna_categorias ,retorna_presenca } from '../models/select.js'
import {retorna_alunos_por_categoria } from '../models/select.js'
import { insere_presenca } from '../models/insert.js';
import {atualiza_presenca } from '../models/update.js';

export async function registraPresenca(req,res){
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
      'Nome':alunos['nome'],
      'Data':data_presenca,
      'Rg':alunos['rg_aluno'],
    }
    if(presente){
      alunos_presentes.push(dados)
      await insere_presenca(dados)
    }else{
      alunos_ausentes.push(dados)    
    }
  }
  for (const alunosAusentes of alunos_ausentes) {
    const rg = alunosAusentes['Rg']
    const getAlunos = await get_alunos_rg(rg)
    const ajustes = await get_ajustes()
    for (const alunos of getAlunos) {
      let nro_faltas = alunos['faltas']
      let nro_aulas = ajustes['aulas']
      let faltas_totais = nro_faltas + 1
      let frequencia = 100 - (faltas_totais / nro_aulas) * 100
      const dados = {
        'Rg':rg,
        'Frequencia': frequencia,
        'Faltas': faltas_totais,
      }
      await atualiza_presenca(dados)
    }
  }
  return res.status(201).json({
    mensagem:"Presença registrada com sucesso!"
  })
}

export async function PresencaCategoria(req,res) {
  const categorias = await retorna_categorias()
  return res.status(200).json({
    data:categorias
  })
}


export async function historicoPresenca(req,res) {
  const alunos = await retorna_presenca()
  return res.status(200).json({
    data:alunos
  })
}