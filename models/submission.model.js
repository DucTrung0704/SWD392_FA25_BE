import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    exam_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true,
    },
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    answers: [{
        flashcard_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Flashcard',
            required: true,
        },
        selected_option: {
            type: String,
            enum: ['A', 'B', 'C', 'D'],
            required: true,
        },
        correct_option: {
            type: String,
            enum: ['A', 'B', 'C', 'D'],
        },
        is_correct: {
            type: Boolean,
            default: false,
        },
        answered_at: {
            type: Date,
            default: Date.now,
        },
    }],
    score: {
        type: Number,
        default: 0,
    },
    total_questions: {
        type: Number,
        default: 0,
    },
    correct_answers: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['in_progress', 'submitted', 'expired'],
        default: 'in_progress',
    },
    started_at: {
        type: Date,
        default: Date.now,
    },
    submitted_at: {
        type: Date,
    },
    time_spent: {
        type: Number, // in minutes
        default: 0,
    },
    // Lưu generated options cho mỗi flashcard khi start exam
    generatedOptions: [{
        flashcard_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Flashcard',
        },
        options: {
            A: String,
            B: String,
            C: String,
            D: String,
        },
        correctOption: {
            type: String,
            enum: ['A', 'B', 'C', 'D'],
        },
    }],
});

// Index để tìm kiếm nhanh
submissionSchema.index({ exam_id: 1, student_id: 1 });
submissionSchema.index({ student_id: 1, status: 1 });

export default mongoose.model('Submission', submissionSchema);

