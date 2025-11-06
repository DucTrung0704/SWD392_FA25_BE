import mongoose from 'mongoose';
import crypto from 'crypto';

const classSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    description: { 
        type: String,
        trim: true,
        maxlength: 500
    },
    teacher_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    exams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
    }],
    class_code: {
        type: String,
        unique: true,
        required: true,
        uppercase: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
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

// Middleware để tự động tạo class_code trước khi save
classSchema.pre('save', async function(next) {
    if (this.isNew && !this.class_code) {
        // Tạo class_code ngẫu nhiên 6 ký tự
        let code;
        let isUnique = false;
        
        while (!isUnique) {
            code = crypto.randomBytes(3).toString('hex').toUpperCase().substring(0, 6);
            const existingClass = await mongoose.model('Class').findOne({ class_code: code });
            if (!existingClass) {
                isUnique = true;
            }
        }
        
        this.class_code = code;
    }
    this.updated_at = Date.now();
    next();
});

// Index để tìm kiếm nhanh
classSchema.index({ teacher_id: 1 });
// class_code đã có unique: true nên không cần tạo index riêng
classSchema.index({ students: 1 });

export default mongoose.model('Class', classSchema);

