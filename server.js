import express from 'express'
import ajustesRoutes from './src/routes/ajustesRoutes.js'
import alunoRoutes from './src/routes/alunoRoutes.js'
import categoriasRoutes from './src/routes/categoriasRoutes.js'
import historicoPagamentosRoutes from './src/routes/historicoPagamentosRoutes.js'
import mensalidadeRoutes from './src/routes/mensalidadeRoutes.js'
import mercadoPagoRoutes from './src/routes/mercadoPagoRoutes.js'
import presencaRoutes from './src/routes/presencaRoutes.js'
import responsaveisRoutes from './src/routes/responsaveisRoutes.js'
import usuarioRoutes from './src/routes/usuarioRoutes.js'
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs'
import { get_ajustes } from './src/models/ajustesModel.js';
import { agendarGeracaoMensalidade, exibirCronsMensalidadeAgendadas } from './src/functions/mensalidadeCron.js';

const app = express();
const PORT = process.env.PORT || 3000;
const swaggerDocument = YAML.load("./src/docs/swagger.yaml");

app.use(express.json());
app.use(ajustesRoutes);
app.use(alunoRoutes);
app.use(categoriasRoutes);
app.use(historicoPagamentosRoutes);
app.use(mensalidadeRoutes);
app.use(mercadoPagoRoutes);
app.use(presencaRoutes);
app.use(responsaveisRoutes);
app.use(usuarioRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.urlencoded({ extended: true }));


app.get("/",(req,res) =>{
    res.redirect("/api-docs")
})

async function inicializarCronsMensalidade() {
    try {
        const ajustes = await get_ajustes();

        if (ajustes && ajustes.data_virada_mes && ajustes.valor_mensalidade !== undefined && ajustes.valor_mensalidade !== null) {
            agendarGeracaoMensalidade(ajustes.data_virada_mes, ajustes.valor_mensalidade);
        } else {
            console.log('[Cron Mensalidades] Ajustes incompletos para agendamento automático na inicialização.');
        }
    } catch (error) {
        console.error('[Cron Mensalidades] Erro ao inicializar crons:', error.message);
    } finally {
        exibirCronsMensalidadeAgendadas();
    }
}

async function iniciarServidor() {
    await inicializarCronsMensalidade();

    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

iniciarServidor();