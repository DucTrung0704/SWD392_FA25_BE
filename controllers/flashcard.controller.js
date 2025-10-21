const Flashcard = require('../models/flashcard.model');
const path = require('path');

// ==================================================
// 🔹 CREATE FLASHCARD (Teacher only)
// ==================================================
exports.createFlashcard = async (req, res) => {
    try {
        const { deck_id, tag, note } = req.body;

        // Kiểm tra ảnh hợp lệ
        if (!req.files || !req.files.question_image || !req.files.answer_image) {
            return res.status(400).json({ message: 'Question and Answer images are required' });
        }

        const questionPath = `${process.env.BASE_URL}/upload/flashcards/${req.files.question_image[0].filename}`;
        const answerPath = `${process.env.BASE_URL}/upload/flashcards/${req.files.answer_image[0].filename}`;

        const card = await Flashcard.create({
            deck_id,
            question_image: questionPath,
            answer_image: answerPath,
            tag,
            note,
        });

        res.status(201).json({ message: 'Flashcard created successfully', card });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==================================================
// 🔹 GET ALL FLASHCARDS (All users - optional)
// ==================================================
exports.getAllFlashcards = async (req, res) => {
    try {
        const cards = await Flashcard.find().sort({ created_at: -1 });
        res.json({ count: cards.length, flashcards: cards });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==================================================
// 🔹 GET FLASHCARDS BY DECK (Student / Teacher)
// ==================================================
exports.getFlashcardsByDeck = async (req, res) => {
    try {
        const { deckId } = req.params;
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
exports.getFlashcardById = async (req, res) => {
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
exports.updateFlashcard = async (req, res) => {
    try {
        const { id } = req.params;
        const { tag, note } = req.body;
        const card = await Flashcard.findById(id);
        if (!card) return res.status(404).json({ message: 'Flashcard not found' });

        // Cập nhật ảnh nếu có upload mới
        if (req.files?.question_image) {
            card.question_image = `${process.env.BASE_URL}/upload/flashcards/${req.files.question_image[0].filename}`;
        }
        if (req.files?.answer_image) {
            card.answer_image = `${process.env.BASE_URL}/upload/flashcards/${req.files.answer_image[0].filename}`;
        }

        card.tag = tag || card.tag;
        card.note = note || card.note;
        await card.save();

        res.json({ message: 'Flashcard updated successfully', card });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==================================================
// 🔹 DELETE FLASHCARD (Teacher only)
// ==================================================
exports.deleteFlashcard = async (req, res) => {
    try {
        const card = await Flashcard.findById(req.params.id);
        if (!card) return res.status(404).json({ message: 'Flashcard not found' });

        await card.deleteOne();
        res.json({ message: 'Flashcard deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
