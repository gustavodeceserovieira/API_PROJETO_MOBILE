
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { get_mensalidade_by_id, conclui_mensalidade_pix } from '../models/mensalidadesModel.js';
import dotenv from 'dotenv'
import { criar_cobranca, get_cobranca_by_id, delete_cobrancas_by_mensalidade } from '../models/cobrancaModel.js';
import { enviarNotificacao } from '../functions/functions.js';
import { get_administrador } from '../models/usuarioModel.js';

dotenv.config();

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN });
const payment = new Payment(client);

export async function gerarCobrancaPix(body) {
    try {
        const mensalidade = await get_mensalidade_by_id(body.id_mensalidade);

        if (!mensalidade) {
            throw new Error('Mensalidade não encontrada para o ID: ' + body.id_mensalidade);
        }

        if (mensalidade.pago === 1) {
            return {
                status: 400,
                body: { mensagem: 'Mensalidade já paga' },
            };
        }

        const resultado = await payment.create({ 
            body: {
                transaction_amount: 0.02,
                description: 'Pagamento Mensalidade',
                payment_method_id: 'pix',
                payer: { 
                    email: 'mikaelfernandesmoreira@gmail.com' 
                }
            },
            // requestOptions: { 
            //     idempotencyKey: `mp_pix_${body.id_mensalidade}`
            // }
        });

        await criar_cobranca({
            id: resultado.id,
            id_mensalidade: body.id_mensalidade,
            valor: mensalidade.valor,
            data_expiracao: resultado.date_of_expiration
        });

        if (!resultado || !resultado.point_of_interaction || !resultado.point_of_interaction.transaction_data) {
            throw new Error('Resposta inesperada do Mercado Pago: ' + JSON.stringify(resultado));
        }

        const { qr_code, qr_code_base64, ticket_url } = resultado.point_of_interaction.transaction_data;
        const qr_code_renderizado = qr_code_base64
            ? `data:image/png;base64,${qr_code_base64}`
            : null;

        return {
            status: 201,
            body: { 
                r: resultado,
                link: qr_code,
                qr_code_img: qr_code_base64,
                qr_code_renderizado,
                ticket_url            
            },
        };
    } catch (err) {
        return {
            status: 500,
            body: { mensagem: err.message },
        };
    }
}

export async function concluirCobrancaPix(body) {
    try {
        if (body.type !== 'payment') {
            return { status: 200, body: { mensagem: "Evento ignorado" } };
        }

        const paymentId = body.data.id;
        const paymentData = await payment.get({ id: paymentId });

        if (paymentData.status === 'approved') {
            const cobranca = await get_cobranca_by_id(paymentId);

            if (!cobranca) {
                throw new Error('Cobrança não encontrada para o ID do pagamento: ' + paymentId);
            }

            await delete_cobrancas_by_mensalidade(cobranca.id_mensalidade);
            await conclui_mensalidade_pix(cobranca.id_mensalidade);

            const administrador = await get_administrador();
            
            await enviarNotificacao(
                administrador.expo_token,
                'Pagamento Aprovado',
                `Você recebeu um pagamento de R$ ${cobranca.valor}.`
            );

            return {
                status: 200,
                body: { mensagem: "Sucesso!" },
            };
        }

        return { status: 200, body: { mensagem: "Aguardando aprovação" } };
        
    } catch (err) {
        console.error("Erro no Webhook:", err.message);
        return {
            status: 500, 
            body: { mensagem: err.message },
        };
    }
}