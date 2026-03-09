import Router from 'express'
import { get_alunos } from '../models/select.js';

const router = Router()


router.get("/", (req, res) => {
  res.json("API está funcionando");
});


router.get("/get_alunos", async (req, res) => {
  const usuarios = await get_alunos()
  res.json(usuarios);
});


export default router;
