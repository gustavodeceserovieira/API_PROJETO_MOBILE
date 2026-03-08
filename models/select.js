import getConexao from '../bd/bd.js'
const db = await getConexao()

export default async function get_ajustes() {
  const [row] = await db.execute('SELECT * FROM ajustes');
  if(row.length == 0){
      return {
      'qtd':row.length,
    }
  }
  return{
    'qtd':row.length,
    'aulas':row[0]['quantidade_aulas'],
    'mensalidade':row[0]['valor_mensalidade'],
    'data_virada':row[0]['data_virada_mes'],
  }
  
}
export async function get_alunos() {
  const [rows] = await db.execute('SELECT * FROM aluno order by rg_aluno asc');
  return rows
}
export async function get_alunos_rg(rg) {
  const [rows] = await db.execute('SELECT * FROM aluno WHERE rg_aluno=? order by nome asc',[rg]);
  return rows
}
export async function retorna_historico_pagamento() {
  const [rows] = await db.execute('SELECT * FROM historico_pagamento order by data_pagamento desc');
  return rows
}
export async function get_rg(nome) {
  const [rows] = await db.execute('SELECT rg_aluno FROM aluno WHERE nome=?',[nome]);
  return rows
}
export async function get_responsaveis() {
  const [rows] = await db.execute('SELECT * FROM responsaveis order by rg_aluno asc');
  return rows
}
export async function get_responsaveis_rg(rg) {
  const [rows] = await db.execute('SELECT nome, telefone FROM responsaveis WHERE rg_aluno=? order by rg_aluno asc',[rg]);
  return rows[0]
}


export async function login(){
  const [rows] = await db.execute('SELECT * FROM usuario');
  return {
    'quantidade':rows.length,
    'usuarios':rows
  }
}
export async function retorna_presenca(){
  const [rows] = await db.execute('SELECT * FROM presenca order by data_presenca desc');
  return rows
}
export async function retorna_categorias(){
  const [rows] = await db.execute('SELECT * FROM categorias order by rg_aluno');
  return rows
}
export async function retorna_alunos_por_categoria(id){
  const [rows] = await db.execute('SELECT rg_aluno, nome FROM aluno WHERE aluno.id_categoria=?',[id]);
  return rows
}
export async function retorna_devedores_por_id(id){
  const [rows] = await db.execute('SELECT rg_aluno, nome FROM aluno WHERE aluno.id_categoria=? and mensalidade=0',[id]);
  return rows
}
export async function retorna_devedores(){
  const [rows] = await db.execute('SELECT * FROM aluno WHERE mensalidade=0 order by aluno.id_categoria');
  return rows
}
export async function retorna_categorias_dos_alunos(){
  const [rows] = await db.execute('SELECT nome_categoria FROM aluno LEFT JOIN categorias ON aluno.id_categoria = categorias.id order by aluno.rg_aluno asc');
  return rows
}
  
export async function get_categoria(nome) {
  const [rows] = await db.execute('SELECT id FROM categorias where nome_categoria=?',[nome]);
  return rows[0]['id']
}