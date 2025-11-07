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
    requireTeacherOrAdmin,
    checkOwnership 
} from '../middleware/auth.middleware.js';

const router = express.Router();

// ==================================================
// 👨‍🏫 TEACHER ROUTES (Teacher và Admin có thể truy cập)
// ==================================================

// Tạo question mới
router.post('/teacher/create', verifyToken, requireTeacherOrAdmin, createQuestion);

// Lấy tất cả questions (có filter)
// Teacher chỉ thấy questions của mình, Admin thấy tất cả
router.get('/teacher/all', verifyToken, requireTeacherOrAdmin, getAllQuestions);

// Lấy questions của teacher hiện tại
router.get('/teacher/my-questions', verifyToken, requireTeacherOrAdmin, getMyQuestions);

// Lấy question theo ID
router.get('/teacher/:id', verifyToken, requireTeacherOrAdmin, getQuestionById);

// Cập nhật question
router.put('/teacher/update/:id', verifyToken, requireTeacherOrAdmin, checkOwnership(), updateQuestion);

// Xóa question
router.delete('/teacher/delete/:id', verifyToken, requireTeacherOrAdmin, checkOwnership(), deleteQuestion);

// Xóa nhiều questions cùng lúc
router.post('/teacher/bulk-delete', verifyToken, requireTeacherOrAdmin, bulkDeleteQuestions);

// ==================================================
// 👨‍💼 ADMIN ROUTES (Chỉ Admin)
// ==================================================
router.get('/admin/all', verifyToken, allowRoles('Admin'), getAllQuestions);
router.delete('/admin/delete/:id', verifyToken, allowRoles('Admin'), deleteQuestion);

export default router;

