import {deleta_aluno,deleta_presenca_aluno,deleta_responsaveis_aluno,deleta_aluno_historico} from '../models/delete.js'
import {atualiza_dados_cadastro, atualiza_historico_pagamento, atualiza_historico_presenca } from '../models/update.js';
import {retorna_alunos_por_categoria,get_alunos,get_rg, get_alunos_rg,get_categoria} from '../models/select.js'
import get_ajustes, {retorna_categorias} from '../models/select.js';
import { salva_dados_alunos , salva_dados_resp} from '../models/insert.js';

//Função para o front end
// export async function informacoesAlunos(req,res) {
//     const alunos = await get_alunos();
//     const responsaveis = await get_responsaveis()
//     const categorias = await retorna_categorias_dos_alunos();
//     const data = alunos.map((aluno, i) => ({
//         elementos: aluno,
//         responsaveis: responsaveis[i],
//         categorias: categorias[i]
//     }));
//     return res.status(200).json({
//         dados:data
//     })
// }

function formataData(req){
    const dataFormatada = req.body.data_nascimento
    const [dia, mes, ano] = dataFormatada.split('/')
    return `${ano}-${mes}-${dia}`
}

export async function cadastraAluno(req,res) {
    const dia = new Date()
    const nro_faltas = 0;
    const ajustes = await get_ajustes()
    let frequencia = 100 - (nro_faltas/ajustes['aulas']) * 100
    const dados = {
        'Rg': req.body.rg,
        'Nome':req.body.nome,
        'Resp': req.body.resp,
        'Tel':req.body.tel,
        'Data_nascimento': formataData(req),
        'Frequencia': frequencia,
        'Faltas': nro_faltas,
        'Mensalidade': 0,
        'Data_cadastro': dia,
        'Id_categoria': await get_categoria(req.body.categoria)
    }
    const dadosBanco = await get_alunos()
    await retorna_categorias()
    for (const alunos of dadosBanco) {
    if(alunos['rg_aluno'] == req.body.rg){
        return res.status(409).json({
            mensagem:"Aluno já está cadastrado!"
        })
        }
    }
    await salva_dados_alunos(dados)
    await salva_dados_resp(dados)
    return res.status(201).json({
        mensagem:"Aluno cadastrado com sucesso!"
    })
}

export async function deletaAluno(rg_aluno,req,res){
    await deleta_presenca_aluno(rg_aluno)
    await deleta_aluno_historico(rg_aluno)
    await deleta_responsaveis_aluno(rg_aluno)
    const resultado = await deleta_aluno(rg_aluno)
    if(resultado['affectedRows'] === 0){
        return res.status(404).json({
            mensagem: "Aluno não encontrado!"
        })
    }
    return res.status(200).json({
        mensagem: "Aluno deletado com sucesso!"
    })
}

export async function editaAluno(req,res) {
    let rgAntigo = req.body.rg
    let alunosRg = await get_alunos_rg(rgAntigo)
    const dados = {
        'Nome': req.body.nome_atualizado,
        'Data_nascimento': formataData(req),
        'Id_categoria':await get_categoria(req.body.categoria)
    }
    const resultado = await atualiza_dados_cadastro(dados,rgAntigo)
    if(resultado['affectedRows'] === 0){
        return res.status(404).json({
            mensagem:"Aluno não encontrado!"
        }) 
    }
   
    for (const alunos of alunosRg) {
        await atualiza_historico_pagamento(dados['Nome'],alunos['rg_aluno'])
        await atualiza_historico_presenca(dados['Nome'],alunos['rg_aluno'])
    }
    return res.status(201).json({
        mensagem:"Aluno atualizado com sucesso"
    })
    //return res.redirect('mostraInformacoes')
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