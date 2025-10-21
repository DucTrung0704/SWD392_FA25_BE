import FlashcardDeck from '../models/deck.model.js';

// =============================
// 🔹 CREATE DECK (Teacher only)
// =============================
export const createDeck = async (req, res) => {
    try {
        const { title, description } = req.body;

        const newDeck = await FlashcardDeck.create({
            title,
            description,
            created_by: req.user.id, // từ token
        });

        res.status(201).json({ message: 'Flashcard deck created', deck: newDeck });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================
// 🔹 GET ALL DECKS (Public / Student allowed)
// =============================
export const getAllDecks = async (req, res) => {
    try {
        const decks = await FlashcardDeck.find()
            .populate('created_by', 'name email role')
            .sort({ created_at: -1 });

        res.json(decks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================
// 🔹 GET DECK BY ID
// =============================
export const getDeckById = async (req, res) => {
    try {
        const deck = await FlashcardDeck.findById(req.params.id).populate('created_by', 'name email');
        if (!deck) return res.status(404).json({ message: 'Deck not found' });
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
        const deck = await FlashcardDeck.findById(id);
        if (!deck) return res.status(404).json({ message: 'Deck not found' });

        // Chỉ người tạo mới được sửa
        if (deck.created_by.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You do not have permission to edit this deck' });
        }

        deck.title = req.body.title || deck.title;
        deck.description = req.body.description || deck.description;
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
