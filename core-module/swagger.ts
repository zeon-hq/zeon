const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation for ZEON CORE',
    },
    servers: [
      {
        url: `http://localhost:3001`,
      },
    ],
  },
  apis: ['./schema/*.ts','./routes/*.ts'],
};

const specs = swaggerJSDoc(options);

function swaggerDocs(app:any) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  console.log('Swagger docs created');
};

export default swaggerDocs;