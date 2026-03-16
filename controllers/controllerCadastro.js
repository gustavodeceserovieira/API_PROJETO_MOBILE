import get_ajustes, {get_alunos, get_categoria, retorna_categorias} from '../models/select.js';
import { salva_dados_alunos , salva_dados_resp} from '../models/insert.js';


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
        'Data_nascimento': new Date(req.body.data),
        'Frequencia': frequencia,
        'Faltas': nro_faltas,
        'Mensalidade': 0,
        'Data_cadastro': dia,
        'Id_categoria': await get_categoria(req.body.id_categoria)
    }
    const dadosBanco = await get_alunos()
    await retorna_categorias()
    for (const alunos of dadosBanco) {
    if(alunos['rg_aluno'] == req.body.rg){
        res.staus(409).json({
            mensagem:"Aluno já está cadastrado!"
        })
        }
    }
    await salva_dados_alunos(dados)
    await salva_dados_resp(dados)
    return res.staus(201).json({
        mensagem:"Aluno cadastrado com sucesso!"
    })
}