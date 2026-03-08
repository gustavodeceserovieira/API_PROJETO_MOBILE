const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Alunos",
      version: "1.0.0",
      description: "Documentação da API usando Swagger"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ]
  },
  apis: ["./routes/*"] // arquivos onde estão os endpoints
};

const specs = swaggerJsdoc(options);

module.exports = specs;