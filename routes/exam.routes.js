import express from 'express';
import {
    createExam,
    getAllExams,
    getExamById,
    updateExam,
    deleteExam,
    getMyExams,
    addFlashcardsToExam,
    removeFlashcardsFromExam
} from '../controllers/exam.controller.js';

import { 
    verifyToken, 
    allowRoles, 
    requireTeacherOrAdmin,
    checkOwnership 
} from '../middleware/auth.middleware.js';

const router = express.Router();

// ==================================================
// 👩‍🎓 STUDENT ROUTES (Student có thể xem)
// ==================================================
router.get('/all', verifyToken, getAllExams);
router.get('/all/:id', verifyToken, getExamById);

// ==================================================
// 👨‍🏫 TEACHER ROUTES (Teacher và Admin có thể truy cập)
// ==================================================
// IMPORTANT: Specific routes must come before parameterized routes
router.post('/teacher/create', verifyToken, requireTeacherOrAdmin, createExam);
router.get('/teacher/my-exams', verifyToken, requireTeacherOrAdmin, getMyExams);
router.put('/teacher/update/:id', verifyToken, requireTeacherOrAdmin, checkOwnership(), updateExam);
router.delete('/teacher/delete/:id', verifyToken, requireTeacherOrAdmin, checkOwnership(), deleteExam);

// Flashcard management routes
router.post('/teacher/:id/add-flashcards', verifyToken, requireTeacherOrAdmin, checkOwnership(), addFlashcardsToExam);
router.post('/teacher/:id/remove-flashcards', verifyToken, requireTeacherOrAdmin, checkOwnership(), removeFlashcardsFromExam);

// ==================================================
// 👨‍💼 ADMIN ROUTES (Chỉ Admin)
// ==================================================
router.get('/admin/all', verifyToken, allowRoles('Admin'), getAllExams);
router.delete('/admin/delete/:id', verifyToken, allowRoles('Admin'), deleteExam);

export default router;

