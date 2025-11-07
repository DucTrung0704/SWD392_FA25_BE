import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import connectDB from './config/db.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger/swagger.config.js';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================================================
// ✅ 1️⃣  Kết nối MongoDB
// ==================================================
connectDB();

// ==================================================
// ✅ 2️⃣  Khởi tạo ứng dụng Express
// ==================================================
const app = express();

// ==================================================
// ✅ 3️⃣  Middleware cơ bản
// ==================================================

// CORS Configuration - Cho phép frontend gọi API
app.use(cors({
  origin: 'http://localhost:5173',  // Cho phép frontend Vite
  credentials: true,  // Cho phép gửi cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Cho phép truy cập ảnh trong thư mục /upload (avatar, flashcards,...)
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// Public assets (nếu có)
app.use(express.static(path.join(__dirname, 'public')));

// ==================================================
// ✅ 4️⃣  Middleware xác thực JWT (CommonJS)
// ==================================================
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user payload
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// ==================================================
// ✅ 5️⃣  Import routes
// ==================================================
import userRoutes from './routes/user.routes.js';
import flashcardDeckRoutes from './routes/deck.routes.js';
import flashcardRoutes from './routes/flashcard.routes.js';
import examRoutes from './routes/exam.routes.js';
import submissionRoutes from './routes/submission.routes.js';
import classRoutes from './routes/class.routes.js';
import questionRoutes from './routes/question.routes.js';

// ==================================================
// ✅ 6️⃣  Gắn routes vào app
// ==================================================
app.use('/api/user', userRoutes);
app.use('/api/deck', flashcardDeckRoutes);
app.use('/api/flashcard', flashcardRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/submission', submissionRoutes);
app.use('/api/class', classRoutes);
app.use('/api/question', questionRoutes);

// ==================================================
// ✅ 8️⃣  Swagger Documentation
// ==================================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'MathFlash API Documentation'
}));

// ✅ Route gốc (Health Check)
app.get('/', (req, res) => {
  res.json({ 
    message: 'MathFlash API running 🚀',
    documentation: 'Visit /api-docs for API documentation'
  });
});

// ==================================================
// ✅ 7️⃣  Error Handling
// ==================================================

// 404 Not Found
app.use((req, res, next) => {
  next(createError(404, `Cannot ${req.method} ${req.originalUrl}`));
});

// General Error Handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
