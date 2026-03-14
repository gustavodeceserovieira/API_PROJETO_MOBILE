import {deleta_aluno,deleta_presenca_aluno,deleta_responsaveis_aluno,deleta_aluno_historico} from '../models/delete.js'
import { atualiza_dados, atualiza_historico_pagamento, atualiza_historico_presenca } from '../models/update.js';
import {retorna_alunos_por_categoria,get_alunos,get_responsaveis,retorna_categorias_dos_alunos,get_rg, get_alunos_rg} from '../models/select.js'

/*

export async function EditaAluno(req,res) {
    const alunos = await get_alunos()
    const categoriasAlunos = await retorna_categorias_dos_alunos()
    const categorias = await retorna_categorias()
    const map = alunos.map((aluno,i) => ({
        alunos:aluno,
        categoriasAlunos: categoriasAlunos[i],
    }));
  return res.render('editaAluno',{data:map,data1:categorias})
}
*/

/*
    
        */
export async function informacoesAlunos(req,res) {
    const alunos = await get_alunos();
    const responsaveis = await get_responsaveis()
    const categorias = await retorna_categorias_dos_alunos();
    const data = alunos.map((aluno, i) => ({
        elementos: aluno,
        responsaveis: responsaveis[i],
        categorias: categorias[i]
    }));
    return res.status(200).json({
        dados:data
    })
}

export async function deletaAluno(rg_aluno){
    await deleta_presenca_aluno(rg_aluno)
    await deleta_aluno_historico(rg_aluno)
    await deleta_responsaveis_aluno(rg_aluno)
    await deleta_aluno(rg_aluno)
}


export async function editaAluno(req,res) {
    let rgAntigo = req.body.rg.split(" ")[0]
    let alunosRg = await get_alunos_rg(rgAntigo)
    if(req.body.on){
        for (const alunos of alunosRg ) {
          deletaAluno(alunos['rg_aluno'])
        }
        res.status(201).json({
            mensagem:"Aluno removido com sucesso!"
        })
      }else{
        const dados = {
            'Nome': req.body.nome_atualizado.trim(),
            'Data_nascimento':req.body.data.trim(),
            'Id_categoria':await get_categoria(req.body.categoria.trim())
        }
        await atualiza_dados(dados,rgAntigo)
        res.status(201).json({
            mensagem:"Aluno atualizado com sucesso"
        })
        for (const alunos of alunosRg) {
            await atualiza_historico_pagamento(dados['Nome'],alunos['rg_aluno'])
            await atualiza_historico_presenca(dados['Nome'],alunos['rg_aluno'])
        }
        return res.json({
            mensagem:"Ir para o front"
        })
        //return res.redirect('mostraInformacoes')
    }
}
 

export async function getAlunosCategoria(req,res) {
    const categoria = req.params.id_categoria
    const alunos = await retorna_alunos_por_categoria(categoria)
    res.json(
    alunos.map(aluno => ({
        rg: aluno['rg_aluno'],
        nome: aluno['nome']
    })));
}

export async function getAlunosNome(req,res) {
    const nome = req.params.nome  
    const resposta = await get_rg(nome)
    res.status(200).json({
        "Alunos": resposta
    })
}