import express from 'express';
import {
    createFlashcard,
    getAllFlashcards,
    updateFlashcard,
    deleteFlashcard,
    getFlashcardsByDeck,
    getMyFlashcards,
    getFlashcardsByTeacher,
} from '../controllers/flashcard.controller.js';

import { 
    verifyToken, 
    allowRoles, 
    requireTeacherOrAdmin,
    checkOwnership 
} from '../middleware/auth.middleware.js';

const router = express.Router();

// ==================================================
// 👩‍🎓 STUDENT ROUTES (Student có thể xem và học)
// ==================================================
router.get('/student/deck/:deckId', verifyToken, getFlashcardsByDeck);

// ==================================================
// 👨‍🏫 TEACHER ROUTES (Teacher và Admin có thể truy cập)
// ==================================================
router.get('/teacher/all', verifyToken, requireTeacherOrAdmin, getAllFlashcards);
router.get('/teacher/my-flashcards', verifyToken, requireTeacherOrAdmin, getMyFlashcards);

router.post(
    '/teacher/create',
    verifyToken,
    requireTeacherOrAdmin,
    createFlashcard
);

router.put(
    '/teacher/update/:id',
    verifyToken,
    requireTeacherOrAdmin,
    checkOwnership(),
    updateFlashcard
);

router.delete(
    '/teacher/delete/:id',
    verifyToken,
    requireTeacherOrAdmin,
    checkOwnership(),
    deleteFlashcard
);

// Get flashcards by teacher ID (Teacher chỉ xem được của mình, Admin xem được tất cả)
router.get('/teacher/:teacherId', verifyToken, requireTeacherOrAdmin, getFlashcardsByTeacher);

// ==================================================
// 👨‍💼 ADMIN ROUTES (Chỉ Admin)
// ==================================================
router.get('/admin/all', verifyToken, allowRoles('Admin'), getAllFlashcards);
router.delete('/admin/delete/:id', verifyToken, allowRoles('Admin'), deleteFlashcard);

export default router;