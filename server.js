import express from 'express'
import rotas_POST from './routes/rotas_POST.js'
import rotas_GET from './routes/rotas_GET.js'
import rotas_DELETE from './routes/rotas_DELETE.js'
import rotas_PATCH from './routes/rotas_PATCH.js'
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs'

const app = express();
const PORT = 3000;
const swaggerDocument = YAML.load("./docs/swagger.yaml");
app.use(express.json());
app.use(rotas_GET)
app.use(rotas_POST)
app.use(rotas_DELETE)
app.use(rotas_PATCH)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});