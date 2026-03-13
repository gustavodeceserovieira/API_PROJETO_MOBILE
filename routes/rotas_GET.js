import Router from 'express'
import get_ajustes, { get_alunos, get_categoria, get_responsaveis, get_alunos_rg,get_responsaveis_aluno, retorna_alunos_por_categoria, retorna_categorias, retorna_categorias_dos_alunos, retorna_devedores, retorna_devedores_por_id, retorna_historico_pagamento, retorna_presenca,login,get_rg } from '../models/select.js';

const router = Router()


router.get("/", (req, res) => {
  res.json("API está funcionando");
});


router.get("/get_alunos", async (req, res) => {
  try{
    const alunos = await get_alunos()
    res.json(alunos);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.get("/get_ajustes", async (req, res) => {
  try{
    const ajustes = await get_ajustes()
    res.json(ajustes);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});


router.get("/get_alunos_rg", async (req, res) => {
  try{
    const alunos_rg = await get_alunos_rg(req.body.rg_aluno)
    res.json(alunos_rg);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.get("/historico_pagamento", async (req, res) => {
  try{
    const pagamento = await retorna_historico_pagamento()
    res.json(pagamento);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.get("/get_rg", async (req, res) => {
  try{
    const rg = await get_rg(req.body.nome)
    res.json(rg);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.get("/get_responsaveis", async (req, res) => {
  try{
    const responsaveis = await get_responsaveis()
    res.json(responsaveis);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.get("/get_responsaveis_aluno", async (req, res) => {
  try{
    const respAlunos = await get_responsaveis_aluno(req.body.rg_aluno)
    res.json(respAlunos);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.get("/login", async (req, res) => {
  try{
    const login = await login()
    res.json(login);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.get("/get_presenca", async (req, res) => {
  try{
    const presenca = await retorna_presenca()
    res.json(presenca);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.get("/get_categorias", async (req, res) => {
  try{
    const categorias = await retorna_categorias()
    res.json(categorias);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.get("/get_alunos_categoria", async (req, res) => {
  try{
    const alunosCategoria = await retorna_alunos_por_categoria(req.body.id_categoria)
    res.json(alunosCategoria);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.get("/get_dividas_alunos", async (req, res) => {
  try{
    const devedores = await retorna_devedores_por_id(req.body.id_aluno)
    res.json(devedores);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.get("/get_dividas", async (req, res) => {
  try{
    const dividas = await retorna_devedores()
    res.json(dividas);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.get("/get_categorias_alunos", async (req, res) => {
  try{
    const categoriasAlunos = await retorna_categorias_dos_alunos()
    res.json(categoriasAlunos);
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});

router.get("/get_categoria", async (req, res) => {
  try{
    const categoria = await get_categoria(req.body.nome_categoria)
    res.json(categoria)
  }catch(err){
    res.status(500).json({
      mensagem: `Erro ${err.message}`
    })
  }
});
export default router;