import express from 'express';
import {
    createDeck,
    getAllDecks,
    getDeckById,
    updateDeck,
    deleteDeck,
} from '../controllers/deck.controller.js';

import { verifyToken } from '../middleware/auth.middleware.js';
import { allowRoles } from '../middleware/role.middleware.js';

const router = express.Router();

// 👩‍🎓 Student - View only
router.get('/all', verifyToken, getAllDecks);
router.get('/all/:id', verifyToken, getDeckById);

// 👨‍🏫 Teacher - CRUD
router.post('/teacher/create', verifyToken, allowRoles('Teacher', 'Admin'), createDeck);
router.put('/teacher/update/:id', verifyToken, allowRoles('Teacher', 'Admin'), updateDeck);
router.delete('/teacher/delete/:id', verifyToken, allowRoles('Teacher', 'Admin'), deleteDeck);

export default router;