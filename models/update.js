import getConexao from '../bd/bd.js'
const db = await getConexao()

export async function atualiza_dados(dados,rg){
  const[rows] = await db.execute('UPDATE aluno SET nome=?, data_nascimento=?, id_categoria=? WHERE rg_aluno=?',
    [dados['Nome'],dados['Data_nascimento'],dados['Id_categoria'],rg])
  return rows
}
export async function zera_faltas(){
  const query = await db.execute('SET SQL_SAFE_UPDATES=0')
  const row = await db.execute('UPDATE aluno SET faltas=0, frequencia=100 WHERE rg_aluno IS NOT NULL')
  const query1 = await db.execute('SET SQL_SAFE_UPDATES=1')
  return row
}

export async function atualiza_dados_responsaveis(dados,rg){
  const[rows] = await db.execute('UPDATE responsaveis SET nome=?, telefone=? WHERE rg_aluno=?',[dados['Nome'],dados['Tel'],rg])
  return rows
}
export async function atualiza_mensalidade(dados){
  const[rows] = await db.execute('UPDATE aluno SET mensalidade=? WHERE rg_aluno=? and mensalidade=0',[dados['Mensalidade'],dados['Rg']])
  return rows
}
export async function atualiza_ajustes(qtdAulas,valorMensalidade,viradaMes){
  const query = await db.execute('SET SQL_SAFE_UPDATES=0')
  const[rows] = await db.execute('UPDATE ajustes SET quantidade_aulas=?, valor_mensalidade=?, data_virada_mes=?',[qtdAulas,valorMensalidade,viradaMes])
  const query1= await db.execute('SET SQL_SAFE_UPDATES=1')
  return rows
}
export async function atualiza_frequencia(dados){
  const[rows] = await db.execute('UPDATE aluno SET frequencia=? WHERE rg_aluno=?',[dados['frequencia'],dados['rg_aluno']])
  return rows
}
export async function zera_mensalidade(){
  const[rows] = await db.execute('UPDATE aluno SET mensalidade=? WHERE rg_aluno!=?',[0,' '])
  return rows
}
export async function atualiza_presenca(dados){
  const[rows] = await db.execute('UPDATE aluno SET frequencia=?, faltas=? WHERE rg_aluno=?',[dados['Frequencia'],dados['Faltas'],dados['Rg']])
  return rows
}
export async function atualiza_historico_pagamento(nome,rg_antigo){
  const[rows] = await db.execute('UPDATE historico_pagamento SET nome_aluno=? WHERE rg_aluno=?',[nome,rg_antigo])
  return rows
}
export async function atualiza_historico_presenca(nome,rg_antigo){
  const[rows] = await db.execute('UPDATE presenca SET nome=? WHERE rg_aluno=?',[nome,rg_antigo])
  return rows
}