import Flashcard from '../models/flashcard.model.js';
import FlashcardDeck from '../models/deck.model.js';
import User from '../models/user.model.js';

// ==================================================
// 🔹 CREATE FLASHCARD (Teacher only)
// ==================================================
export const createFlashcard = async (req, res) => {
    try {
        const { deck_id, question, answer, tag, status } = req.body;

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
        if (!tag) {
            return res.status(400).json({ message: 'Tag is required' });
        }

        // Validate tag
        const validTags = ['geometry', 'algebra', 'probability', 'calculus', 'statistics', 'other'];
        if (!validTags.includes(tag)) {
            return res.status(400).json({ message: `Tag must be one of: ${validTags.join(', ')}` });
        }

        // Validate status if provided
        if (status && !['easy', 'medium', 'hard'].includes(status)) {
            return res.status(400).json({ message: 'Status must be one of: easy, medium, hard' });
        }

        const cardData = {
            deck_id,
            question,
            answer,
            tag,
            status: status || 'medium', // Default to medium
        };

        const card = await Flashcard.create(cardData);

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

        // Student chỉ có thể xem flashcards từ public decks (status = true)
        if (userRole === 'Student' && deck.status !== true) {
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
        const { question, answer, tag, status } = req.body;
        const card = await Flashcard.findById(id);
        if (!card) return res.status(404).json({ message: 'Flashcard not found' });

        // Validate tag if provided
        if (tag !== undefined) {
            const validTags = ['geometry', 'algebra', 'probability', 'calculus', 'statistics', 'other'];
            if (!validTags.includes(tag)) {
                return res.status(400).json({ message: `Tag must be one of: ${validTags.join(', ')}` });
            }
        }

        // Validate status if provided
        if (status !== undefined && !['easy', 'medium', 'hard'].includes(status)) {
            return res.status(400).json({ message: 'Status must be one of: easy, medium, hard' });
        }

        // Cập nhật các trường nếu có
        if (question !== undefined) card.question = question;
        if (answer !== undefined) card.answer = answer;
        if (tag !== undefined) card.tag = tag;
        if (status !== undefined) card.status = status;

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

// ==================================================
// 🔹 GET MY FLASHCARDS (Teacher only)
// Lấy tất cả flashcards từ các decks mà teacher tạo
// ==================================================
export const getMyFlashcards = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const userRole = req.user.role;

        // Tìm tất cả decks của teacher
        const teacherDecks = await FlashcardDeck.find({ created_by: teacherId });
        const deckIds = teacherDecks.map(deck => deck._id);

        if (deckIds.length === 0) {
            return res.json({
                message: 'My flashcards retrieved successfully',
                count: 0,
                flashcards: [],
                decks: []
            });
        }

        // Tìm tất cả flashcards thuộc các decks của teacher
        const flashcards = await Flashcard.find({ deck_id: { $in: deckIds } })
            .populate('deck_id', 'title description')
            .sort({ created_at: -1 });

        res.json({
            message: 'My flashcards retrieved successfully',
            count: flashcards.length,
            flashcards,
            total_decks: teacherDecks.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==================================================
// 🔹 GET FLASHCARDS BY TEACHER (Teacher/Admin only)
// Lấy tất cả flashcards từ các decks của một teacher cụ thể
// ==================================================
export const getFlashcardsByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const currentUserId = req.user.id;
        const userRole = req.user.role;

        // Teacher chỉ có thể xem flashcards của chính mình, Admin có thể xem tất cả
        if (userRole !== 'Admin' && teacherId !== currentUserId) {
            return res.status(403).json({ message: 'You can only view your own flashcards' });
        }

        // Tìm tất cả decks của teacher
        const teacherDecks = await FlashcardDeck.find({ created_by: teacherId })
            .populate('created_by', 'name email role');
        
        if (teacherDecks.length === 0) {
            // Nếu không có decks, vẫn cần lấy thông tin teacher
            const teacher = await User.findById(teacherId).select('name email role');
            
            return res.json({
                message: 'Teacher flashcards retrieved successfully',
                count: 0,
                flashcards: [],
                teacher: teacher || null,
                total_decks: 0
            });
        }

        const deckIds = teacherDecks.map(deck => deck._id);

        // Tìm tất cả flashcards thuộc các decks của teacher
        const flashcards = await Flashcard.find({ deck_id: { $in: deckIds } })
            .populate('deck_id', 'title description created_by')
            .sort({ created_at: -1 });

        res.json({
            message: 'Teacher flashcards retrieved successfully',
            count: flashcards.length,
            flashcards,
            teacher: teacherDecks[0].created_by,
            total_decks: teacherDecks.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
