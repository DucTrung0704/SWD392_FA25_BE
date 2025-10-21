const express = require('express');
const {
    createFlashcard,
    getAllFlashcards,
    getFlashcardById,
    updateFlashcard,
    deleteFlashcard,
    getFlashcardsByDeck,
} = require('../controllers/flashcard.controller');

const { verifyToken } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');
const upload = require('../config/multer');

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

module.exports = router;
