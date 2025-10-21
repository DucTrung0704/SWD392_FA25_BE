import express from 'express';
import {
    createFlashcard,
    getAllFlashcards,
    getFlashcardById,
    updateFlashcard,
    deleteFlashcard,
    getFlashcardsByDeck,
} from '../controllers/flashcard.controller.js';

import { verifyToken } from '../middleware/auth.middleware.js';
import { allowRoles } from '../middleware/role.middleware.js';
import upload from '../config/multer.js';

const router = express.Router();

// 👩‍🎓 STUDENT - View & Learn
router.get('/student/all', verifyToken, getAllFlashcards);
router.get('/student/:id', verifyToken, getFlashcardById);
router.get('/student/deck/:deckId', verifyToken, getFlashcardsByDeck);

// 👩‍🏫 TEACHER - CRUD
router.post(
    '/teacher/create',
    verifyToken,
    allowRoles('Teacher', 'Admin'),
    upload.fields([
        { name: 'question_image', maxCount: 1 },
        { name: 'answer_image', maxCount: 1 },
    ]),
    createFlashcard
);

router.put(
    '/teacher/update/:id',
    verifyToken,
    allowRoles('Teacher', 'Admin'),
    upload.fields([
        { name: 'question_image', maxCount: 1 },
        { name: 'answer_image', maxCount: 1 },
    ]),
    updateFlashcard
);

router.delete(
    '/teacher/delete/:id',
    verifyToken,
    allowRoles('Teacher', 'Admin'),
    deleteFlashcard
);

export default router;
