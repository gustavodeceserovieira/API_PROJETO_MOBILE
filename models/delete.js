export async function deleta_aluno_historico(rg_aluno,transaction){
  const[rows] = await transaction.query('DELETE FROM historico_pagamento WHERE rg_aluno=?',[rg_aluno])
  return rows
}
export async function deleta_aluno(rg_aluno,transaction){
  const[rows] = await transaction.execute('DELETE FROM aluno WHERE rg_aluno=?',[rg_aluno])
  return rows
}
export async function deleta_responsaveis_aluno(rg_aluno,transaction){
  const[rows] = await transaction.execute('DELETE FROM responsaveis WHERE rg_aluno=?',[rg_aluno])
  return rows
}
export async function deleta_presenca_aluno(rg_aluno,transaction){
  const[rows] = await transaction.execute('DELETE FROM presenca WHERE rg_aluno=?',[rg_aluno])
  return rows
}
export async function deleta_usuario(usuario,transaction){
  const query = await transaction.execute('SET SQL_SAFE_UPDATES=0')
  const row = await transaction.execute('DELETE FROM usuario WHERE nome=?',[usuario])
  const query1 = await transaction.execute('SET SQL_SAFE_UPDATES=1')
  return row
}

