import express from 'express';
import {
    createFlashcard,
    getAllFlashcards,
    getFlashcardById,
    updateFlashcard,
    deleteFlashcard,
    getFlashcardsByDeck,
} from '../controllers/flashcard.controller.js';

import { 
    verifyToken, 
    allowRoles, 
    requireTeacherOrAdmin,
    checkOwnership 
} from '../middleware/auth.middleware.js';
import upload from '../config/multer.js';

const router = express.Router();

// ==================================================
// 👩‍🎓 STUDENT ROUTES (Student có thể xem và học)
// ==================================================
router.get('/student/all', verifyToken, getAllFlashcards);
router.get('/student/:id', verifyToken, getFlashcardById);
router.get('/student/deck/:deckId', verifyToken, getFlashcardsByDeck);

// ==================================================
// 👨‍🏫 TEACHER ROUTES (Teacher và Admin có thể truy cập)
// ==================================================
router.post(
    '/teacher/create',
    verifyToken,
    requireTeacherOrAdmin,
    upload.fields([
        { name: 'question_image', maxCount: 1 },
        { name: 'answer_image', maxCount: 1 },
    ]),
    createFlashcard
);

router.put(
    '/teacher/update/:id',
    verifyToken,
    requireTeacherOrAdmin,
    checkOwnership(),
    upload.fields([
        { name: 'question_image', maxCount: 1 },
        { name: 'answer_image', maxCount: 1 },
    ]),
    updateFlashcard
);

router.delete(
    '/teacher/delete/:id',
    verifyToken,
    requireTeacherOrAdmin,
    checkOwnership(),
    deleteFlashcard
);

// ==================================================
// 👨‍💼 ADMIN ROUTES (Chỉ Admin)
// ==================================================
router.get('/admin/all', verifyToken, allowRoles('Admin'), getAllFlashcards);
router.delete('/admin/delete/:id', verifyToken, allowRoles('Admin'), deleteFlashcard);

export default router;