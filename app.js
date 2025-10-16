require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');

// Import routes
const userRouter = require('./routes/user.routes');

// ==================================================
// ✅ 1️⃣  Kết nối MongoDB
// ==================================================
connectDB();

// ==================================================
// ✅ 2️⃣  Khởi tạo ứng dụng
// ==================================================
const app = express();

// ==================================================
// ✅ 3️⃣  Middleware cơ bản
// ==================================================
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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
// ✅ 5️⃣  Routes
// ==================================================

// Public routes
app.use('/api/user', userRouter);

// Protected routes (example)
app.get('/api/user/profile', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Token valid ✅',
    user: req.user,
  });
});

// Health check (root endpoint)
app.get('/', (req, res) => {
  res.json({ message: 'MathFlash API running 🚀' });
});

// ==================================================
// ✅ 6️⃣  Error Handling
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

module.exports = app;
