import express from 'express'
import dotenv from 'dotenv'
import rotas_POST from './routes/rotas_POST.js'
import rotas_GET from './routes/rotas_GET.js'
import getConexao from './bd/bd.js'
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs'


dotenv.config()
const app = express();
const PORT = 3000;
const swaggerDocument = YAML.load("./docs/swagger.yaml");
const bd = getConexao();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(rotas_GET)
app.use(rotas_POST)
app.use(express.urlencoded({ extended: true }));


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});