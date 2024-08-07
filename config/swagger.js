const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurant API',
      version: '1.0.0',
      description: 'API documentation for the Restaurant application',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Restaurant: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated id of the restaurant',
            },
            name: {
              type: 'string',
              description: 'Name of the restaurant',
            },
            address: {
              type: 'string',
              description: 'Address of the restaurant',
            },
            // Add other restaurant properties as needed
          },
          required: ['name', 'address'],
          example: {
            _id: '60d5f483fc13ae1e41000001',
            name: 'Pasta Palace',
            address: '123 Pasta Lane',
          },
        },
        Dish: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated id of the dish',
            },
            name: {
              type: 'string',
              description: 'Name of the dish',
            },
            description: {
              type: 'string',
              description: 'Description of the dish',
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Price of the dish',
            },
            // Add other dish properties as needed
          },
          required: ['name', 'price'],
          example: {
            _id: '60d5f483fc13ae1e41000002',
            name: 'Spaghetti Carbonara',
            description: 'Classic Italian pasta dish with eggs, cheese, pancetta, and pepper.',
            price: 12.99,
          },
        },
      },
    },
  },
  apis: ['./routes/*.js', './models/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
