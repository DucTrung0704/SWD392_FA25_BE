import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MathFlash API',
      version: '1.0.0',
      description: 'A comprehensive API for MathFlash application - a flashcard learning platform',
      contact: {
        name: 'MathFlash Team',
        email: 'support@mathflash.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User\'s full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            role: {
              type: 'string',
              enum: ['Student', 'Teacher', 'Admin'],
              description: 'User role'
            },
            avatar: {
              type: 'string',
              description: 'Avatar image URL'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date'
            }
          }
        },
        Deck: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Deck ID'
            },
            title: {
              type: 'string',
              description: 'Deck title'
            },
            description: {
              type: 'string',
              description: 'Deck description'
            },
            subject: {
              type: 'string',
              description: 'Subject/category'
            },
            difficulty: {
              type: 'string',
              enum: ['easy', 'medium', 'hard'],
              description: 'Difficulty level'
            },
            isPublic: {
              type: 'boolean',
              description: 'Whether deck is public'
            },
            createdBy: {
              type: 'string',
              description: 'Creator user ID'
            },
            flashcards: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of flashcard IDs'
            }
          }
        },
        Flashcard: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Flashcard ID'
            },
            front: {
              type: 'string',
              description: 'Front side content'
            },
            back: {
              type: 'string',
              description: 'Back side content'
            },
            image: {
              type: 'string',
              description: 'Image URL'
            },
            deckId: {
              type: 'string',
              description: 'Parent deck ID'
            },
            difficulty: {
              type: 'string',
              enum: ['easy', 'medium', 'hard'],
              description: 'Difficulty level'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'integer',
              description: 'HTTP status code'
            },
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./swagger/docs/*.js'] // Path to the API documentation files
};

export default swaggerJsdoc(options);