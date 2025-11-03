import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
    deck_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FlashcardDeck',
        required: true,
    },
    question: {
        type: String, 
        required: true,
    },
    answer: {
        type: String, 
        required: true,
    },
    tag: {
        type: String,
        default: '',
    },
    note: {
        type: String,
        default: '',
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Flashcard', flashcardSchema);
