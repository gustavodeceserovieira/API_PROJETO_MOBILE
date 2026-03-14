import pool from '../bd/bd.js'

export async function salva_dados_alunos(dados){
  const [rows] = await pool.execute('INSERT INTO aluno (rg_aluno, nome, data_nascimento, frequencia, Faltas, mensalidade, data_cadastro,id_categoria) VALUES (?,?,?,?,?,?,?,?)',
    [dados['Rg'],dados['Nome'], dados['Data_nascimento'], dados['Frequencia'], dados['Faltas'], dados['Mensalidade'], dados['Data_cadastro'],dados["Id_categoria"]]
  );
  return rows
}

export async function salva_dados_resp(dados) {
  const [rows] = await pool.execute('INSERT INTO responsaveis (nome, telefone,rg_aluno) VALUES (?,?,?)',[dados['Resp'], dados['Tel'],dados['Rg']])
  return rows
}
export async function cria_usuario(usuario,senha){
  const [rows] = await pool.execute('INSERT INTO usuario(nome,senha) VALUES(?,?)',[usuario,senha]);
  return rows
}
export async function insere_ajustes(qtdAulas,valorMensalidade,viradaMes){
  const [rows] = await pool.execute('INSERT INTO ajustes (quantidade_aulas, valor_mensalidade,data_virada_mes) VALUES (?,?,?)',[qtdAulas,valorMensalidade,viradaMes])
  return rows
}

export async function insere_historico(rg,dados,data){
  const [rows] = await pool.execute('INSERT INTO historico_pagamento(rg_aluno, nome_aluno, data_pagamento) VALUES(?,?,?)',[rg,dados['Nome'],data])
  return rows
}
export async function insere_presenca(dados){
  const[rows] = await pool.execute('INSERT INTO presenca(nome, data_presenca,rg_aluno) VALUES(?,?,?)',[dados['Nome'],dados['Data'],dados['Rg']])
  return rows
}  