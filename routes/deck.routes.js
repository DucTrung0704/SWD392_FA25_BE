import express from 'express';
import {
    createDeck,
    getAllDecks,
    getDeckById,
    updateDeck,
    deleteDeck,
    getMyDecks,
    getDecksByTeacher
} from '../controllers/deck.controller.js';

import { 
    verifyToken, 
    allowRoles, 
    requireTeacherOrAdmin,
    checkOwnership 
} from '../middleware/auth.middleware.js';

const router = express.Router();

// ==================================================
// 🔓 PUBLIC ROUTES (Có thể cần xác thực tùy theo logic)
// ==================================================

// ==================================================
// 👩‍🎓 STUDENT ROUTES (Student có thể xem)
// ==================================================
router.get('/all', verifyToken, getAllDecks);
router.get('/all/:id', verifyToken, getDeckById);

// ==================================================
// 👨‍🏫 TEACHER ROUTES (Teacher và Admin có thể truy cập)
// ==================================================
// IMPORTANT: Specific routes must come before parameterized routes
router.post('/teacher/create', verifyToken, requireTeacherOrAdmin, createDeck);
router.get('/teacher/my-decks', verifyToken, requireTeacherOrAdmin, getMyDecks);
router.put('/teacher/update/:id', verifyToken, requireTeacherOrAdmin, checkOwnership(), updateDeck);
router.delete('/teacher/delete/:id', verifyToken, requireTeacherOrAdmin, checkOwnership(), deleteDeck);
router.get('/teacher/:teacherId', verifyToken, requireTeacherOrAdmin, getDecksByTeacher);

// ==================================================
// 👨‍💼 ADMIN ROUTES (Chỉ Admin)
// ==================================================
router.get('/admin/all', verifyToken, allowRoles('Admin'), getAllDecks);
router.delete('/admin/delete/:id', verifyToken, allowRoles('Admin'), deleteDeck);

export default router;