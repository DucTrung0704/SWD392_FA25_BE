import Exam from '../models/exam.model.js';
import Question from '../models/question.model.js';

// =============================
// 🔹 CREATE EXAM (Teacher only)
// =============================
export const createExam = async (req, res) => {
    try {
        const { title, description, questions, time_limit, isPublic } = req.body;

        // Validate required fields
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        // Validate user ID from token
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User authentication required' });
        }

        // Validate isPublic if provided
        if (isPublic !== undefined && typeof isPublic !== 'boolean') {
            return res.status(400).json({ message: 'isPublic must be a boolean' });
        }

        // Validate time_limit if provided
        if (time_limit !== undefined && (typeof time_limit !== 'number' || time_limit <= 0)) {
            return res.status(400).json({ message: 'Time limit must be a positive number (in minutes)' });
        }

        // Validate questions if provided
        if (questions && Array.isArray(questions)) {
            if (questions.length === 0) {
                return res.status(400).json({ message: 'Questions array cannot be empty' });
            }

            // Verify all question IDs exist and are active
            const validQuestions = await Question.find({ 
                _id: { $in: questions },
                isActive: true 
            });
            
            if (validQuestions.length !== questions.length) {
                return res.status(400).json({ message: 'One or more question IDs are invalid or inactive' });
            }

            // Teacher chỉ có thể dùng questions của mình (trừ Admin)
            if (req.user.role !== 'Admin') {
                const teacherQuestions = validQuestions.filter(
                    q => q.created_by.toString() === req.user.id
                );
                if (teacherQuestions.length !== questions.length) {
                    return res.status(403).json({ message: 'You can only use questions from your question bank' });
                }
            }
        } else {
            return res.status(400).json({ message: 'Questions array is required' });
        }

        const newExam = await Exam.create({
            title,
            description,
            questions: questions || [],
            time_limit: time_limit || 60,
            isPublic: isPublic !== undefined ? isPublic : false,
            created_by: req.user.id,
        });

        // Populate created_by for response
        await newExam.populate('created_by', 'name email');
        await newExam.populate('questions');

        res.status(201).json({ message: 'Exam created successfully', exam: newExam });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================
// 🔹 GET ALL EXAMS
// Student chỉ thấy exams có isPublic = true
// Teacher/Admin thấy tất cả
// =============================
export const getAllExams = async (req, res) => {
    try {
        const userRole = req.user?.role;

        // Student chỉ thấy public exams (isPublic = true), Teacher/Admin thấy tất cả
        const query = (userRole === 'Student') 
            ? { isPublic: true } 
            : {};

        const exams = await Exam.find(query)
            .populate('created_by', 'name email role')
            .populate('questions')
            .sort({ created_at: -1 });

        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================
// 🔹 GET EXAM BY ID
// Student chỉ có thể xem public exams
// Teacher/Admin có thể xem tất cả
// =============================
export const getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id)
            .populate('created_by', 'name email')
            .populate('questions');
        
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        const userRole = req.user?.role;
        
        // Student chỉ có thể xem public exams
        if (userRole === 'Student' && exam.isPublic !== true) {
            return res.status(403).json({ message: 'Access denied. This exam is not public' });
        }

        res.json(exam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================
// 🔹 UPDATE EXAM (Teacher only)
// =============================
export const updateExam = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, time_limit, isPublic } = req.body;
        const exam = await Exam.findById(id);
        
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Chỉ người tạo hoặc admin mới được sửa
        if (exam.created_by.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You do not have permission to edit this exam' });
        }

        // Validate isPublic if provided
        if (isPublic !== undefined && typeof isPublic !== 'boolean') {
            return res.status(400).json({ message: 'isPublic must be a boolean' });
        }

        // Validate time_limit if provided
        if (time_limit !== undefined && (typeof time_limit !== 'number' || time_limit <= 0)) {
            return res.status(400).json({ message: 'Time limit must be a positive number (in minutes)' });
        }

        // Update fields if provided
        if (title !== undefined) exam.title = title;
        if (description !== undefined) exam.description = description;
        if (time_limit !== undefined) exam.time_limit = time_limit;
        if (isPublic !== undefined) exam.isPublic = isPublic;

        await exam.save();

        // Populate for response
        await exam.populate('created_by', 'name email');
        await exam.populate('questions');

        res.json({ message: 'Exam updated successfully', exam });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================
// 🔹 DELETE EXAM (Teacher only)
// =============================
export const deleteExam = async (req, res) => {
    try {
        const { id } = req.params;
        const exam = await Exam.findById(id);
        
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Chỉ người tạo hoặc admin mới được xóa
        if (exam.created_by.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You do not have permission to delete this exam' });
        }

        await exam.deleteOne();
        res.json({ message: 'Exam deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================
// 🔹 GET MY EXAMS (Teacher only)
// =============================
export const getMyExams = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const exams = await Exam.find({ created_by: teacherId })
            .populate('created_by', 'name email')
            .populate('questions')
            .sort({ created_at: -1 });

        res.json({
            message: 'My exams retrieved successfully',
            exams,
            total: exams.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================
// 🔹 ADD QUESTIONS TO EXAM (Teacher only)
// Thêm questions từ question bank vào exam
// =============================
export const addQuestionsToExam = async (req, res) => {
    try {
        const { id } = req.params;
        const { question_ids } = req.body;

        if (!question_ids || !Array.isArray(question_ids) || question_ids.length === 0) {
            return res.status(400).json({ message: 'question_ids must be a non-empty array' });
        }

        const exam = await Exam.findById(id);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Chỉ người tạo hoặc admin mới được thêm questions
        if (exam.created_by.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You do not have permission to modify this exam' });
        }

        // Verify all question IDs exist and are active
        const validQuestions = await Question.find({ 
            _id: { $in: question_ids },
            isActive: true 
        });
        
        if (validQuestions.length !== question_ids.length) {
            return res.status(400).json({ message: 'One or more question IDs are invalid or inactive' });
        }

        // Teacher chỉ có thể dùng questions của mình (trừ Admin)
        if (req.user.role !== 'Admin') {
            const teacherQuestions = validQuestions.filter(
                q => q.created_by.toString() === req.user.id
            );
            if (teacherQuestions.length !== question_ids.length) {
                return res.status(403).json({ message: 'You can only use questions from your question bank' });
            }
        }

        // Add questions to exam (avoid duplicates)
        const existingQuestions = exam.questions.map(id => id.toString());
        const newQuestions = question_ids.filter(id => !existingQuestions.includes(id.toString()));
        
        if (newQuestions.length === 0) {
            return res.status(400).json({ message: 'All questions are already in this exam' });
        }

        exam.questions.push(...newQuestions);
        await exam.save();

        // Populate for response
        await exam.populate('created_by', 'name email');
        await exam.populate('questions');

        res.json({ 
            message: `${newQuestions.length} question(s) added successfully`,
            exam,
            added_count: newQuestions.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================
// 🔹 REMOVE QUESTIONS FROM EXAM (Teacher only)
// Xóa questions khỏi exam
// =============================
export const removeQuestionsFromExam = async (req, res) => {
    try {
        const { id } = req.params;
        const { question_ids } = req.body;

        if (!question_ids || !Array.isArray(question_ids) || question_ids.length === 0) {
            return res.status(400).json({ message: 'question_ids must be a non-empty array' });
        }

        const exam = await Exam.findById(id);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Chỉ người tạo hoặc admin mới được xóa questions
        if (exam.created_by.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You do not have permission to modify this exam' });
        }

        // Remove questions from exam
        const initialLength = exam.questions.length;
        exam.questions = exam.questions.filter(
            id => !question_ids.includes(id.toString())
        );
        const removedCount = initialLength - exam.questions.length;

        if (removedCount === 0) {
            return res.status(400).json({ message: 'No questions were removed. They may not exist in this exam' });
        }

        await exam.save();

        // Populate for response
        await exam.populate('created_by', 'name email');
        await exam.populate('questions');

        res.json({ 
            message: `${removedCount} question(s) removed successfully`,
            exam,
            removed_count: removedCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

