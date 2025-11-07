import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true,
    },
    answer: {
        type: String,
        required: true,
        trim: true,
    },
    // 4 đáp án A, B, C, D cho multiple choice (optional)
    options: {
        A: { type: String },
        B: { type: String },
        C: { type: String },
        D: { type: String },
    },
    // Đáp án đúng: 'A', 'B', 'C', hoặc 'D' (optional)
    correctOption: {
        type: String,
        enum: ['A', 'B', 'C', 'D'],
    },
    // Thể loại câu hỏi
    tag: {
        type: String,
        enum: ['geometry', 'algebra', 'probability', 'calculus', 'statistics', 'other'],
        required: true,
    },
    // Độ khó
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
    },
    // Giải thích (optional)
    explanation: {
        type: String,
        trim: true,
    },
    // Người tạo (Teacher)
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Trạng thái (có thể dùng để ẩn/hiện)
    isActive: {
        type: Boolean,
        default: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

// Middleware để tự động cập nhật updated_at
questionSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

export default mongoose.model('Question', questionSchema);

