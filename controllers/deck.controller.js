import FlashcardDeck from '../models/deck.model.js';

// =============================
// 🔹 CREATE DECK (Teacher only)
// =============================
export const createDeck = async (req, res) => {
    try {
        const { title, description, status, difficulty } = req.body;

        // Validate required fields
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        // Validate user ID from token
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User authentication required' });
        }

        // Validate status if provided (must be boolean)
        if (status !== undefined && typeof status !== 'boolean') {
            return res.status(400).json({ message: 'Status must be a boolean (true = public, false = draft)' });
        }

        // Validate difficulty if provided
        if (difficulty && !['easy', 'medium', 'hard'].includes(difficulty)) {
            return res.status(400).json({ message: 'Difficulty must be either "easy", "medium", or "hard"' });
        }

        const newDeck = await FlashcardDeck.create({
            title,
            description,
            status: status !== undefined ? status : false, // Default to false (draft)
            difficulty: difficulty || 'medium', // Default to medium
            created_by: req.user.id, // từ token
        });

        res.status(201).json({ message: 'Flashcard deck created', deck: newDeck });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================
// 🔹 GET ALL DECKS (Public / Student allowed)
// Student chỉ thấy decks có status = 'public'
// Teacher/Admin thấy tất cả decks
// =============================
export const getAllDecks = async (req, res) => {
    try {
        const userRole = req.user?.role;
        
        // Student chỉ thấy public decks (status = true), Teacher/Admin thấy tất cả
        const query = (userRole === 'Student') 
            ? { status: true } 
            : {};

        const decks = await FlashcardDeck.find(query)
            .populate('created_by', 'name email role')
            .sort({ created_at: -1 });

        res.json(decks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================
// 🔹 GET DECK BY ID
// Student chỉ có thể xem public decks
// Teacher/Admin có thể xem tất cả
// =============================
export const getDeckById = async (req, res) => {
    try {
        const deck = await FlashcardDeck.findById(req.params.id).populate('created_by', 'name email');
        if (!deck) return res.status(404).json({ message: 'Deck not found' });

        const userRole = req.user?.role;
        
        // Student chỉ có thể xem public decks (status = true)
        if (userRole === 'Student' && deck.status !== true) {
            return res.status(403).json({ message: 'Access denied. This deck is not public' });
        }

        res.json(deck);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================
// 🔹 UPDATE DECK (Teacher only)
// =============================
export const updateDeck = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, difficulty } = req.body;
        const deck = await FlashcardDeck.findById(id);
        if (!deck) return res.status(404).json({ message: 'Deck not found' });

        // Chỉ người tạo mới được sửa
        if (deck.created_by.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You do not have permission to edit this deck' });
        }

        // Validate status if provided (must be boolean)
        if (status !== undefined && typeof status !== 'boolean') {
            return res.status(400).json({ message: 'Status must be a boolean (true = public, false = draft)' });
        }

        // Validate difficulty if provided
        if (difficulty && !['easy', 'medium', 'hard'].includes(difficulty)) {
            return res.status(400).json({ message: 'Difficulty must be either "easy", "medium", or "hard"' });
        }

        // Update fields if provided
        if (title !== undefined) deck.title = title;
        if (description !== undefined) deck.description = description;
        if (status !== undefined) deck.status = status;
        if (difficulty !== undefined) deck.difficulty = difficulty;

        await deck.save();

        res.json({ message: 'Deck updated successfully', deck });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================
// 🔹 DELETE DECK (Teacher only)
// =============================
export const deleteDeck = async (req, res) => {
    try {
        const { id } = req.params;
        const deck = await FlashcardDeck.findById(id);
        if (!deck) return res.status(404).json({ message: 'Deck not found' });

        // Chỉ người tạo hoặc admin mới được xóa
        if (deck.created_by.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You do not have permission to delete this deck' });
        }

        await deck.deleteOne();
        res.json({ message: 'Deck deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================
// 🔹 GET MY DECKS (Teacher only)
// =============================
export const getMyDecks = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const decks = await FlashcardDeck.find({ created_by: teacherId })
            .populate('created_by', 'name email')
            .sort({ created_at: -1 });

        res.json({
            message: 'My decks retrieved successfully',
            decks,
            total: decks.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================
// 🔹 GET DECKS BY TEACHER (Teacher/Admin only)
// =============================
export const getDecksByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const decks = await FlashcardDeck.find({ created_by: teacherId })
            .populate('created_by', 'name email role')
            .sort({ created_at: -1 });

        res.json({
            message: 'Teacher decks retrieved successfully',
            decks,
            total: decks.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};