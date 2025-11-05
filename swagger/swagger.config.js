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
            isPublic: {
              type: 'boolean',
              description: 'Whether deck is public (true = public, false = private)'
            },
            status: {
              type: 'boolean',
              description: 'Deprecated - use isPublic instead'
            },
            difficulty: {
              type: 'string',
              enum: ['easy', 'medium', 'hard'],
              description: 'Difficulty level'
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
            deck_id: {
              type: 'string',
              description: 'Parent deck ID'
            },
            question: {
              type: 'string',
              description: 'Question text'
            },
            answer: {
              type: 'string',
              description: 'Answer text'
            },
            options: {
              type: 'object',
              description: 'Multiple choice options (optional - auto-generated when taking exam)',
              properties: {
                A: { type: 'string' },
                B: { type: 'string' },
                C: { type: 'string' },
                D: { type: 'string' }
              }
            },
            correctOption: {
              type: 'string',
              enum: ['A', 'B', 'C', 'D'],
              description: 'Correct option (optional - auto-generated when taking exam)'
            },
            tag: {
              type: 'string',
              enum: ['geometry', 'algebra', 'probability'],
              description: 'Flashcard category tag'
            },
            status: {
              type: 'string',
              enum: ['easy', 'medium', 'hard'],
              description: 'Difficulty level'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation date'
            }
          }
        },
        Exam: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Exam ID'
            },
            title: {
              type: 'string',
              description: 'Exam title'
            },
            description: {
              type: 'string',
              description: 'Exam description'
            },
            flashcards: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of flashcard IDs'
            },
            time_limit: {
              type: 'number',
              description: 'Time limit in minutes'
            },
            total_questions: {
              type: 'number',
              description: 'Total number of questions'
            },
            isPublic: {
              type: 'boolean',
              description: 'Whether exam is public'
            },
            created_by: {
              type: 'string',
              description: 'Creator user ID'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation date'
            }
          }
        },
        Submission: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Submission ID'
            },
            exam_id: {
              type: 'string',
              description: 'Exam ID'
            },
            student_id: {
              type: 'string',
              description: 'Student user ID'
            },
            answers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  flashcard_id: { type: 'string' },
                  selected_option: {
                    type: 'string',
                    enum: ['A', 'B', 'C', 'D']
                  },
                  correct_option: {
                    type: 'string',
                    enum: ['A', 'B', 'C', 'D']
                  },
                  is_correct: { type: 'boolean' },
                  answered_at: { type: 'string', format: 'date-time' }
                }
              }
            },
            score: {
              type: 'number',
              description: 'Final score (0-100)'
            },
            total_questions: {
              type: 'number',
              description: 'Total number of questions'
            },
            correct_answers: {
              type: 'number',
              description: 'Number of correct answers'
            },
            status: {
              type: 'string',
              enum: ['in_progress', 'submitted', 'expired'],
              description: 'Submission status'
            },
            started_at: {
              type: 'string',
              format: 'date-time',
              description: 'Start time'
            },
            submitted_at: {
              type: 'string',
              format: 'date-time',
              description: 'Submit time'
            },
            time_spent: {
              type: 'number',
              description: 'Time spent in minutes'
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