import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: {
            values: ['Admin', 'Teacher', 'Student'],
            message: 'Role must be Admin, Teacher, or Student'
        },
        default: 'Student',
        required: true
    },
    avatar: {
        type: String,
        default: '../uploads/avatar.png'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    updated_at: { 
        type: Date, 
        default: Date.now 
    }
});

// Tự động hash password nếu chưa được hash trước khi lưu
userSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }

        if (this.password && !this.password.startsWith('$2')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Hash password trong update operations (findOneAndUpdate)
userSchema.pre('findOneAndUpdate', async function(next) {
    try {
        const update = this.getUpdate();
        if (!update) {
            return next();
        }

        // Nếu password nằm trong $set
        const password = update.password || update.$set?.password;
        if (password && !password.startsWith('$2')) {
            const hashed = await bcrypt.hash(password, 10);
            if (update.password) {
                update.password = hashed;
            } else {
                update.$set.password = hashed;
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

export default mongoose.model('User', userSchema);

