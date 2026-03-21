import express from 'express'
import ajustesRoutes from './src/routes/ajustesRoutes.js'
import alunoRoutes from './src/routes/alunoRoutes.js'
import historicoPagamentosRoutes from './src/routes/historicoPagamentosRoutes.js'
import mensalidadeRoutes from './src/routes/mensalidadeRoutes.js'
import presencaRoutes from './src/routes/presencaRoutes.js'
import responsaveisRoutes from './src/routes/responsaveisRoutes.js'
import usuarioRoutes from './src/routes/usuarioRoutes.js'
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs'

const app = express();
const PORT = 3000;
const swaggerDocument = YAML.load("./src/docs/swagger.yaml");

app.use(express.json());
app.use(ajustesRoutes);
app.use(alunoRoutes);
app.use(historicoPagamentosRoutes);
app.use(mensalidadeRoutes);
app.use(presencaRoutes);
app.use(responsaveisRoutes);
app.use(usuarioRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});