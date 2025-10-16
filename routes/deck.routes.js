const express = require('express');
const {
    createDeck,
    getAllDecks,
    getDeckById,
    updateDeck,
    deleteDeck,
} = require('../controllers/deck.controller');

const { verifyToken } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const router = express.Router();

// 👩‍🎓 Student - View only
router.get('/all', verifyToken, getAllDecks);
router.get('/all/:id', verifyToken, getDeckById);

// 👨‍🏫 Teacher - CRUD
router.post('/teacher/create', verifyToken, allowRoles('Teacher', 'Admin'), createDeck);
router.put('/teacher/update/:id', verifyToken, allowRoles('Teacher', 'Admin'), updateDeck);
router.delete('/teacher/delete/:id', verifyToken, allowRoles('Teacher', 'Admin'), deleteDeck);

module.exports = router;
