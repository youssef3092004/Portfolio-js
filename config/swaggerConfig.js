const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bookify API',
      version: '1.0.0',
      description: 'Webstack - Portfolio Project for booking hotels API documentation with Swagger',
      contact: {
        name: 'Kareem Hany',
        email: 'kareemhany.eng@gmail.com',
      },
    },
    externalDocs: {
      description: 'Contact Youssef Ahmed',
      url: 'mailto:#',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
    },
    security: [
      {
        BeareAuth: [],
      },
    ],
    tags: [
      { name: 'Authentication' }, // Make Auth tag first tag
    ],
  },
  apis: ['./routes/*.js'],
};


const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerDocs
};
