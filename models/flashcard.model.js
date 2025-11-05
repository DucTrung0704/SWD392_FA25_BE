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
    // 4 đáp án A, B, C, D cho multiple choice (optional - sẽ tự động generate khi làm bài)
    options: {
        A: { type: String },
        B: { type: String },
        C: { type: String },
        D: { type: String },
    },
    // Đáp án đúng: 'A', 'B', 'C', hoặc 'D' (optional - sẽ tự động generate khi làm bài)
    correctOption: {
        type: String,
        enum: ['A', 'B', 'C', 'D'],
    },
    tag: {
        type: String,
        enum: ['geometry', 'algebra', 'probability'],
        required: true,
    },
    status: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Flashcard', flashcardSchema);
