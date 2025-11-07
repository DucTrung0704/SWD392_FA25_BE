import express from 'express';
import {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    getMyQuestions,
    updateQuestion,
    deleteQuestion,
    bulkDeleteQuestions
} from '../controllers/question.controller.js';

import { 
    verifyToken, 
    allowRoles, 
    checkOwnership 
} from '../middleware/auth.middleware.js';

const router = express.Router();

// ==================================================
// 👨‍🏫 TEACHER ROUTES (Teacher only)
// ==================================================

// Tạo question mới
router.post('/teacher/create', verifyToken, allowRoles('Teacher'), createQuestion);

// Lấy tất cả questions (có filter)
router.get('/teacher/all', verifyToken, allowRoles('Teacher'), getAllQuestions);

// Lấy questions của teacher hiện tại
router.get('/teacher/my-questions', verifyToken, allowRoles('Teacher'), getMyQuestions);

// Lấy question theo ID
router.get('/teacher/:id', verifyToken, allowRoles('Teacher'), getQuestionById);

// Cập nhật question
router.put('/teacher/update/:id', verifyToken, allowRoles('Teacher'), checkOwnership(), updateQuestion);

// Xóa question
router.delete('/teacher/delete/:id', verifyToken, allowRoles('Teacher'), checkOwnership(), deleteQuestion);

// Xóa nhiều questions cùng lúc
router.post('/teacher/bulk-delete', verifyToken, allowRoles('Teacher'), bulkDeleteQuestions);

export default router;

