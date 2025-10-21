import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['Admin', 'Teacher', 'Student'],
        default: 'Student'
    },
    avatar: {
        type: String,
        default: '../uploads/avatar.png'
    },
    created_at: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
