import Exam from '../models/exam.model.js';
import Flashcard from '../models/flashcard.model.js';

// =============================
// 🔹 CREATE EXAM (Teacher only)
// =============================
export const createExam = async (req, res) => {
    try {
        const { title, description, flashcards, time_limit, isPublic } = req.body;

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

        // Validate flashcards if provided
        if (flashcards && Array.isArray(flashcards)) {
            // Verify all flashcard IDs exist
            const validFlashcards = await Flashcard.find({ _id: { $in: flashcards } });
            if (validFlashcards.length !== flashcards.length) {
                return res.status(400).json({ message: 'One or more flashcard IDs are invalid' });
            }
        }

        const newExam = await Exam.create({
            title,
            description,
            flashcards: flashcards || [],
            time_limit: time_limit || 60,
            isPublic: isPublic !== undefined ? isPublic : false,
            created_by: req.user.id,
        });

        // Populate created_by for response
        await newExam.populate('created_by', 'name email');
        await newExam.populate('flashcards');

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
            .populate('flashcards')
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
            .populate('flashcards');
        
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
        await exam.populate('flashcards');

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
            .populate('flashcards')
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
// 🔹 ADD FLASHCARDS TO EXAM (Teacher only)
// =============================
export const addFlashcardsToExam = async (req, res) => {
    try {
        const { id } = req.params;
        const { flashcard_ids } = req.body;

        if (!flashcard_ids || !Array.isArray(flashcard_ids) || flashcard_ids.length === 0) {
            return res.status(400).json({ message: 'flashcard_ids must be a non-empty array' });
        }

        const exam = await Exam.findById(id);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Chỉ người tạo hoặc admin mới được thêm flashcards
        if (exam.created_by.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You do not have permission to modify this exam' });
        }

        // Verify all flashcard IDs exist
        const validFlashcards = await Flashcard.find({ _id: { $in: flashcard_ids } });
        if (validFlashcards.length !== flashcard_ids.length) {
            return res.status(400).json({ message: 'One or more flashcard IDs are invalid' });
        }

        // Add flashcards to exam (avoid duplicates)
        const existingFlashcards = exam.flashcards.map(id => id.toString());
        const newFlashcards = flashcard_ids.filter(id => !existingFlashcards.includes(id.toString()));
        
        if (newFlashcards.length === 0) {
            return res.status(400).json({ message: 'All flashcards are already in this exam' });
        }

        exam.flashcards.push(...newFlashcards);
        await exam.save();

        // Populate for response
        await exam.populate('created_by', 'name email');
        await exam.populate('flashcards');

        res.json({ 
            message: `${newFlashcards.length} flashcard(s) added successfully`,
            exam,
            added_count: newFlashcards.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================
// 🔹 REMOVE FLASHCARDS FROM EXAM (Teacher only)
// =============================
export const removeFlashcardsFromExam = async (req, res) => {
    try {
        const { id } = req.params;
        const { flashcard_ids } = req.body;

        if (!flashcard_ids || !Array.isArray(flashcard_ids) || flashcard_ids.length === 0) {
            return res.status(400).json({ message: 'flashcard_ids must be a non-empty array' });
        }

        const exam = await Exam.findById(id);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Chỉ người tạo hoặc admin mới được xóa flashcards
        if (exam.created_by.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You do not have permission to modify this exam' });
        }

        // Remove flashcards from exam
        const initialLength = exam.flashcards.length;
        exam.flashcards = exam.flashcards.filter(
            id => !flashcard_ids.includes(id.toString())
        );
        const removedCount = initialLength - exam.flashcards.length;

        if (removedCount === 0) {
            return res.status(400).json({ message: 'No flashcards were removed. They may not exist in this exam' });
        }

        await exam.save();

        // Populate for response
        await exam.populate('created_by', 'name email');
        await exam.populate('flashcards');

        res.json({ 
            message: `${removedCount} flashcard(s) removed successfully`,
            exam,
            removed_count: removedCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

