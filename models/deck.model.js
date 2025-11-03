import mongoose from 'mongoose';

const flashcardDeckSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    status: { type: String, enum: ['public', 'draft'], default: 'draft' },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    created_at: { type: Date, default: Date.now },
});

export default mongoose.model('FlashcardDeck', flashcardDeckSchema);
