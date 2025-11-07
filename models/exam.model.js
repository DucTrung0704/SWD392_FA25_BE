import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
    }],
    time_limit: { 
        type: Number, // in minutes
        default: 60 
    },
    total_questions: {
        type: Number,
        default: 0
    },
    isPublic: { 
        type: Boolean, 
        default: false 
    },
    created_by: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    updated_at: { 
        type: Date, 
        default: Date.now 
    },
});

// Middleware để tự động cập nhật total_questions khi questions thay đổi
examSchema.pre('save', function(next) {
    this.total_questions = this.questions ? this.questions.length : 0;
    this.updated_at = Date.now();
    next();
});

export default mongoose.model('Exam', examSchema);

