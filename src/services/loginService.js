import { get_ajustes } from '../models/ajustesModel.js';
import { login } from '../models/usuarioModel.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { get_usuario_by_id, get_usuario_by_rg, salvar_expo_token_usuario } from '../models/usuarioModel.js';
import { get_alunos_rg, get_resumo } from '../models/alunoModel.js';

dotenv.config();

export async function autenticarUsuario(body) {
    try {
        const { email, password, expoToken } = body;
        const dadosUsuariobanco = await login();
        const ajustes = await get_ajustes();

        for (const element of dadosUsuariobanco['usuarios']) {
            if (((element['nome'] == email && email == "Administrador") || element['rg_aluno'] == email) && await bcrypt.compare(password, element['senha'])) {
                const payload = {
                    idUsuario: element.id,
                    usuario: element.nome,
                    role: 'USER',
                };

                if (element.nome == 'Administrador') {
                    payload.role = 'ADMIN';
                }

                if (expoToken) {
                    await salvar_expo_token_usuario(expoToken, element.id);
                }
                
                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '0.5h' });

                let dadosAdicionais = {};

                if (payload.role === 'USER') {
                    const aluno = await get_alunos_rg(element.rg_aluno);
                    dadosAdicionais = aluno;
                } else {
                    const resumo = await get_resumo();
                    dadosAdicionais = resumo;
                }

                return {
                    status: 201,
                    body: {
                        mensagem: 'Usuário autenticado com sucesso!',
                        token: token,
                        user: {
                            ...dadosAdicionais,
                            ...element,
                            role: payload.role,
                        }
                    },
                };
            }
        }

        return {
            status: 401,
            body: { mensagem: 'Usuário ou senha inválidos' },
        };
    } catch (err) {
        return {
            status: 500,
            body: { mensagem: err.message },
        };
    }
}

function buildPayloadAcesso(usuario) {
    const payload = {
        idUsuario: usuario.id,
        usuario: usuario.nome,
        role: 'USER',
    };

    if (usuario.nome == 'Administrador') {
        payload.role = 'ADMIN';
    }

    return payload;
}

export async function ativarBiometria(body, usuarioToken) {
    try {
        const { deviceId, expoToken } = body;
        const usuario = await get_usuario_by_id(usuarioToken.idUsuario);

        if (!usuario) {
            return {
                status: 404,
                body: { mensagem: 'Usuário não encontrado!' },
            };
        }

        if (expoToken) {
            await salvar_expo_token_usuario(expoToken, usuario.id);
        }

        const tokenBiometria = jwt.sign(
            {
                idUsuario: usuario.id,
                rgAluno: usuario.rg_aluno,
                usuario: usuario.nome,
                role: usuarioToken.role,
                tipo: 'BIOMETRIC',
                deviceId,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        return {
            status: 201,
            body: {
                mensagem: 'Biometria ativada com sucesso!',
                tokenBiometria,
            },
        };
    } catch (err) {
        return {
            status: 500,
            body: { mensagem: err.message },
        };
    }
}

export async function autenticarUsuarioBiometria(body) {
    try {
        const { tokenBiometria, deviceId, expoToken } = body;

        let tokenDecodificado;
        try {
            tokenDecodificado = jwt.verify(tokenBiometria, process.env.JWT_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return {
                    status: 401,
                    body: { mensagem: 'Token biométrico expirado' },
                };
            }

            return {
                status: 401,
                body: { mensagem: 'Token biométrico inválido' },
            };
        }

        if (tokenDecodificado.tipo !== 'BIOMETRIC') {
            return {
                status: 401,
                body: { mensagem: 'Token biométrico inválido' },
            };
        }

        if (tokenDecodificado.deviceId !== deviceId) {
            return {
                status: 401,
                body: { mensagem: 'Dispositivo não autorizado para login biométrico' },
            };
        }

        const usuario = await get_usuario_by_id(tokenDecodificado.idUsuario);

        if (!usuario) {
            return {
                status: 404,
                body: { mensagem: 'Usuário não encontrado!' },
            };
        }

        if (expoToken) {
            await salvar_expo_token_usuario(expoToken, usuario.id);
        }

        const payload = buildPayloadAcesso(usuario);
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '0.5h' });

        return {
            status: 201,
            body: {
                mensagem: 'Usuário autenticado com sucesso via biometria!',
                token,
                user: {
                    ...usuario,
                    role: payload.role,
                },
            },
        };
    } catch (err) {
        return {
            status: 500,
            body: { mensagem: err.message },
        };
    }
}
