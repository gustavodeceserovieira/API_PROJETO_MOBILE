import pool from '../bd/bd.js'

export async function deleta_aluno_historico(rg_aluno){
  const[rows] = await pool.query('DELETE FROM historico_pagamento WHERE rg_aluno=?',[rg_aluno])
  return rows
}
export async function deleta_aluno(rg_aluno){
  const[rows] = await pool.execute('DELETE FROM aluno WHERE rg_aluno=?',[rg_aluno])
  return rows
}
export async function deleta_responsaveis_aluno(rg_aluno){
  const[rows] = await pool.execute('DELETE FROM responsaveis WHERE rg_aluno=?',[rg_aluno])
  return rows
}
export async function deleta_presenca_aluno(rg_aluno){
  const[rows] = await pool.execute('DELETE FROM presenca WHERE rg_aluno=?',[rg_aluno])
  return rows
}
export async function deleta_usuario(usuario){
  const query = await pool.execute('SET SQL_SAFE_UPDATES=0')
  const row = await pool.execute('DELETE FROM usuario WHERE nome=?',[usuario])
  const query1 = await pool.execute('SET SQL_SAFE_UPDATES=1')
  return row
}

