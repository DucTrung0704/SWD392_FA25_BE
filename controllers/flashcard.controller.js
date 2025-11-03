import Flashcard from '../models/flashcard.model.js';
import FlashcardDeck from '../models/deck.model.js';

// ==================================================
// 🔹 CREATE FLASHCARD (Teacher only)
// ==================================================
export const createFlashcard = async (req, res) => {
    try {
        const { deck_id, question, answer, tag, note } = req.body;

        // Validate required fields
        if (!deck_id) {
            return res.status(400).json({ message: 'Deck ID is required' });
        }
        if (!question) {
            return res.status(400).json({ message: 'Question is required' });
        }
        if (!answer) {
            return res.status(400).json({ message: 'Answer is required' });
        }

        const card = await Flashcard.create({
            deck_id,
            question,
            answer,
            tag: tag || '',
            note: note || '',
        });

        res.status(201).json({ message: 'Flashcard created successfully', card });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==================================================
// 🔹 GET ALL FLASHCARDS (All users - optional)
// ==================================================
export const getAllFlashcards = async (req, res) => {
    try {
        const cards = await Flashcard.find().sort({ created_at: -1 });
        res.json({ count: cards.length, flashcards: cards });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==================================================
// 🔹 GET FLASHCARDS BY DECK (Student / Teacher)
// Student chỉ có thể xem flashcards từ public decks
// Teacher/Admin có thể xem tất cả
// ==================================================
export const getFlashcardsByDeck = async (req, res) => {
    try {
        const { deckId } = req.params;
        const userRole = req.user?.role;

        // Kiểm tra deck có tồn tại không và student chỉ có thể xem public decks
        const deck = await FlashcardDeck.findById(deckId);
        if (!deck) {
            return res.status(404).json({ message: 'Deck not found' });
        }

        // Student chỉ có thể xem flashcards từ public decks
        if (userRole === 'Student' && deck.status !== 'public') {
            return res.status(403).json({ message: 'Access denied. This deck is not public' });
        }

        const flashcards = await Flashcard.find({ deck_id: deckId }).sort({ created_at: -1 });

        if (!flashcards || flashcards.length === 0) {
            return res.status(404).json({ message: 'No flashcards found for this deck' });
        }

        res.json({
            deck_id: deckId,
            count: flashcards.length,
            flashcards,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==================================================
// 🔹 GET SINGLE FLASHCARD BY ID
// ==================================================
export const getFlashcardById = async (req, res) => {
    try {
        const card = await Flashcard.findById(req.params.id);
        if (!card) return res.status(404).json({ message: 'Flashcard not found' });
        res.json(card);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==================================================
// 🔹 UPDATE FLASHCARD (Teacher only)
// ==================================================
export const updateFlashcard = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer, tag, note } = req.body;
        const card = await Flashcard.findById(id);
        if (!card) return res.status(404).json({ message: 'Flashcard not found' });

        // Cập nhật các trường nếu có
        if (question !== undefined) card.question = question;
        if (answer !== undefined) card.answer = answer;
        if (tag !== undefined) card.tag = tag;
        if (note !== undefined) card.note = note;

        await card.save();

        res.json({ message: 'Flashcard updated successfully', card });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==================================================
// 🔹 DELETE FLASHCARD (Teacher only)
// ==================================================
export const deleteFlashcard = async (req, res) => {
    try {
        const card = await Flashcard.findById(req.params.id);
        if (!card) return res.status(404).json({ message: 'Flashcard not found' });

        await card.deleteOne();
        res.json({ message: 'Flashcard deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
