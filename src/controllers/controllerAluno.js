import {
    cadastraAluno as cadastraAlunoService,
    deletaAluno as deletaAlunoService,
    editaAluno as editaAlunoService,
    getAllAlunos as getAllAlunosService,
    getAlunosCategoria as getAlunosCategoriaService,
    getAlunosNome as getAlunosNomeService
} from '../services/alunoService.js';

export async function getAlunos(req, res) {
    try {
        const alunos = await getAllAlunos(req.params.id_categoria);
        res.status(200).json({ alunos: alunos });
    } catch (err) {
        res.status(500).json({ mensagem: err.message });
    }
}

export async function cadastraAluno(req, res) {
    try {
        const result = await cadastraAlunoService(req.body);
        return res.status(201).json({
            mensagem: result.message
        });
    } catch (err) {
        if (err.message === "Aluno já está cadastrado!") {
            return res.status(409).json({
                mensagem: err.message
            });
        }
        return res.status(500).json({ mensagem: err.message });
    }
}

export async function deletaAluno(req, res) {
    try {
        const result = await deletaAluno(req.body.rg_aluno);
        return res.status(200).json({
            mensagem: result.message
        });
    } catch (err) {
        if (err.message === "Aluno não encontrado!") {
            return res.status(404).json({
                mensagem: err.message
            });
        }
        return res.status(500).json({
            mensagem: err.message
        });
    }
}

export async function editaAluno(req, res) {
    try {
        const data = {
            rg: req.body.rg,
            nome_atualizado: req.body.nome_atualizado,
            data_nascimento: req.body.data_nascimento,
            categoria: req.body.categoria
        };

        const result = await editaAlunoService(data);
        return res.status(201).json({
            mensagem: result.message
        });
    } catch (err) {
        if (err.message === "Aluno não encontrado!") {
            return res.status(404).json({
                mensagem: err.message
            });
        }
        return res.status(500).json({ mensagem: err.message });
    }
}

export async function getAlunosCategoria(req, res) {
    try {
        const alunos = await getAlunosCategoriaService(req.params.id_categoria);
        res.status(200).json({ alunos: alunos });
    } catch (err) {
        res.status(500).json({ mensagem: err.message });
    }
}

export async function getAlunosNome(req, res) {
    try {
        const alunos = await getAlunosNomeService(req.params.nome);
        res.status(200).json({ alunos: alunos });
    } catch (err) {
        res.status(500).json({ mensagem: err.message });
    }
}