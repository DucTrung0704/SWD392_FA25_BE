import express from 'express';
import {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass,
    joinClassByCode,
    removeStudentFromClass,
    addExamToClass,
    removeExamFromClass,
    getClassSubmissions,
    getMyClasses
} from '../controllers/class.controller.js';

import { 
    verifyToken, 
    allowRoles, 
    requireTeacherOrAdmin,
    checkOwnership 
} from '../middleware/auth.middleware.js';

const router = express.Router();

// TEACHER ROUTES (Teacher và Admin có thể truy cập)
router.post('/teacher/create', verifyToken, requireTeacherOrAdmin, createClass);
router.get('/teacher/my-classes', verifyToken, requireTeacherOrAdmin, getMyClasses);
// Teacher chỉ xem classes của mình qua my-classes, không có route /teacher/all
router.get('/teacher/:id', verifyToken, requireTeacherOrAdmin, getClassById);
router.put('/teacher/update/:id', verifyToken, requireTeacherOrAdmin, updateClass);
router.delete('/teacher/delete/:id', verifyToken, requireTeacherOrAdmin, deleteClass);

// Exam management in class
router.post('/teacher/:id/add-exam', verifyToken, requireTeacherOrAdmin, addExamToClass);
router.post('/teacher/:id/remove-exam', verifyToken, requireTeacherOrAdmin, removeExamFromClass);

// Student management in class
router.post('/teacher/:id/remove-student', verifyToken, requireTeacherOrAdmin, removeStudentFromClass);

// View submissions
router.get('/teacher/:id/submissions', verifyToken, requireTeacherOrAdmin, getClassSubmissions);

// STUDENT ROUTES
router.get('/student/my-classes', verifyToken, allowRoles('Student'), getMyClasses);
router.get('/student/all', verifyToken, allowRoles('Student'), getAllClasses);
router.get('/student/:id', verifyToken, allowRoles('Student'), getClassById);
router.post('/student/join', verifyToken, allowRoles('Student'), joinClassByCode);
router.post('/student/:id/leave', verifyToken, allowRoles('Student'), removeStudentFromClass);

// ADMIN ROUTES (Chỉ Admin)
router.get('/admin/all', verifyToken, allowRoles('Admin'), getAllClasses);
router.delete('/admin/delete/:id', verifyToken, allowRoles('Admin'), deleteClass);

export default router;

