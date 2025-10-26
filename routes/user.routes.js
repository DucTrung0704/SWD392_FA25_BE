import express from 'express';
import { 
    registerUser, 
    loginUser, 
    updateUser, 
    getUserProfile,
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser
} from '../controllers/user.controller.js';
import { 
    verifyToken, 
    allowRoles, 
    requireAdmin,
    requireTeacherOrAdmin 
} from '../middleware/auth.middleware.js';
import uploadAvatar from '../config/multer.avatar.js';

const userRouter = express.Router();

// ==================================================
// 🔓 PUBLIC ROUTES (Không cần xác thực)
// ==================================================
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// ==================================================
// 🔒 PROTECTED ROUTES (Cần xác thực)
// ==================================================

// 👤 USER PROFILE ROUTES
userRouter.get('/profile', verifyToken, getUserProfile);
userRouter.put('/update', verifyToken, (req, res, next) => {
    uploadAvatar.single('avatar')(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, updateUser);

// ==================================================
// 👨‍💼 ADMIN ROUTES (Chỉ Admin mới truy cập được)
// ==================================================
userRouter.get('/admin/all', verifyToken, requireAdmin, getAllUsers);
userRouter.get('/admin/:id', verifyToken, requireAdmin, getUserById);
userRouter.put('/admin/update-role/:id', verifyToken, requireAdmin, updateUserRole);
userRouter.delete('/admin/delete/:id', verifyToken, requireAdmin, deleteUser);

// ==================================================
// 👨‍🏫 TEACHER ROUTES (Teacher và Admin có thể truy cập)
// ==================================================
userRouter.get('/teacher/students', verifyToken, requireTeacherOrAdmin, getAllUsers);

export default userRouter;