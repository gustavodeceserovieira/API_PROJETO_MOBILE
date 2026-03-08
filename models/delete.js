import getConexao from '../bd/bd.js'
const db = await getConexao()

export async function deleta_aluno_historico(rg_aluno){
  const[rows] = await db.execute('DELETE FROM historico_pagamento WHERE rg_aluno=?',[rg_aluno])
  return rows
}
export async function deleta_aluno(rg_aluno){
  const[rows] = await db.execute('DELETE FROM aluno WHERE rg_aluno=?',[rg_aluno])
  return rows
}
export async function deleta_responsaveis_aluno(rg_aluno){
  const[rows] = await db.execute('DELETE FROM responsaveis WHERE rg_aluno=?',[rg_aluno])
  return rows
}
export async function deleta_presenca_aluno(rg_aluno){
  const[rows] = await db.execute('DELETE FROM presenca WHERE rg_aluno=?',[rg_aluno])
  return rows
}