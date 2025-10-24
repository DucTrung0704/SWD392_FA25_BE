# MathFlash API Documentation

## Swagger UI Setup

The MathFlash API now uses Swagger UI for interactive API documentation and testing instead of Postman collections. All Swagger documentation is organized in the dedicated `swagger/` folder.

### Project Structure

```
swagger/
├── swagger.config.js          # Main Swagger configuration
└── docs/                      # API documentation files
    ├── user.routes.js         # User endpoints documentation
    ├── deck.routes.js          # Deck endpoints documentation
    └── flashcard.routes.js     # Flashcard endpoints documentation
```

### Accessing the Documentation

1. Start the server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5000/api-docs
   ```

### Features

- **Interactive API Testing**: Test all endpoints directly from the browser
- **Authentication Support**: Built-in JWT Bearer token authentication
- **Request/Response Examples**: See example requests and responses for each endpoint
- **Schema Validation**: View detailed data models and validation rules
- **Role-based Access**: Clear documentation of which endpoints require specific roles
- **Organized Documentation**: All Swagger docs are centralized in the `swagger/` folder

### Authentication

Most endpoints require authentication. To test protected endpoints:

1. First, register a user or login using the `/api/user/register` or `/api/user/login` endpoints
2. Copy the JWT token from the response
3. Click the "Authorize" button in Swagger UI
4. Enter `Bearer <your-token>` in the authorization field
5. Click "Authorize" to authenticate

### Available Endpoints

#### Users
- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - Login user
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/update` - Update user profile and avatar (protected)

#### Decks
- `GET /api/deck/all` - Get all decks (protected)
- `GET /api/deck/all/{id}` - Get deck by ID (protected)
- `POST /api/deck/teacher/create` - Create deck (Teacher/Admin only)
- `PUT /api/deck/teacher/update/{id}` - Update deck (Teacher/Admin only)
- `DELETE /api/deck/teacher/delete/{id}` - Delete deck (Teacher/Admin only)

#### Flashcards
- `GET /api/flashcard/student/all` - Get all flashcards (Student access)
- `GET /api/flashcard/student/{id}` - Get flashcard by ID (Student access)
- `GET /api/flashcard/student/deck/{deckId}` - Get flashcards by deck (Student access)
- `POST /api/flashcard/teacher/create` - Create flashcard (Teacher/Admin only)
- `PUT /api/flashcard/teacher/update/{id}` - Update flashcard (Teacher/Admin only)
- `DELETE /api/flashcard/teacher/delete/{id}` - Delete flashcard (Teacher/Admin only)

### File Uploads

For flashcard creation and updates, you can upload images using the multipart/form-data format in Swagger UI. The supported image fields are:
- `question_image` - Image for the front side
- `answer_image` - Image for the back side

### Server Information

- **Development Server**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/

### Documentation Organization

All Swagger documentation is now properly organized in the `swagger/` folder:
- **Configuration**: `swagger/swagger.config.js` contains the main OpenAPI specification
- **Route Documentation**: Each route group has its own documentation file in `swagger/docs/`
- **Clean Routes**: Route files are now clean and focused only on routing logic
- **Centralized**: All API documentation is in one place for easy maintenance

The API is now fully documented and ready for testing with Swagger UI!
