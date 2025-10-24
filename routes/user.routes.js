import express from 'express';
import { registerUser, loginUser, updateUser, getUserProfile } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import uploadAvatar from '../config/multer.avatar.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Protected routes
userRouter.get('/profile', verifyToken, getUserProfile);

// Update user with file upload error handling
userRouter.put('/update', verifyToken, (req, res, next) => {
    uploadAvatar.single('avatar')(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, updateUser);

export default userRouter;