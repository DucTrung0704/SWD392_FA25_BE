import express from 'express';
import {
    startExam,
    submitAnswer,
    finishExam,
    getSubmission,
    getMySubmissions,
    getSubmissionByExam,
    getAllSubmissions
} from '../controllers/submission.controller.js';

import { 
    verifyToken,
    allowRoles
} from '../middleware/auth.middleware.js';

const router = express.Router();

// ==================================================
// 👩‍🎓 STUDENT ROUTES (Student có thể làm bài)
// ==================================================
// Bắt đầu làm bài
router.post('/student/start/:examId', verifyToken, startExam);

// Nộp câu trả lời
router.post('/student/submit-answer/:submissionId', verifyToken, submitAnswer);

// Hoàn thành và nộp bài
router.post('/student/finish/:submissionId', verifyToken, finishExam);

// Xem chi tiết submission
router.get('/student/:submissionId', verifyToken, getSubmission);

// Xem lịch sử làm bài của mình
router.get('/student/my-submissions', verifyToken, getMySubmissions);

// Xem submission của một exam cụ thể
router.get('/student/exam/:examId', verifyToken, getSubmissionByExam);

// ==================================================
// 👨‍🏫 TEACHER ROUTES (Teacher có thể xem submissions của students)
// ==================================================
// Teacher/Admin có thể xem tất cả submissions với filter options
router.get('/teacher/all', verifyToken, allowRoles('Teacher', 'Admin'), getAllSubmissions);

export default router;

