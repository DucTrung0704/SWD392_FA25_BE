import mongoose from 'mongoose';

const flashcardDeckSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    isPublic: { type: Boolean, default: false }, // true = public, false = private
    status: { type: Boolean, default: false }, // Deprecated: kept for backward compatibility
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    created_at: { type: Date, default: Date.now },
});

// Middleware để sync isPublic và status (backward compatibility)
flashcardDeckSchema.pre('save', function(next) {
    // Đồng bộ status với isPublic
    if (this.isModified('isPublic')) {
        this.status = this.isPublic;
    } else if (this.isModified('status')) {
        this.isPublic = this.status;
    }
    next();
});

export default mongoose.model('FlashcardDeck', flashcardDeckSchema);
