import Question from '../models/question.model.js';

// ==================================================
// 🔹 CREATE QUESTION (Teacher only)
// ==================================================
export const createQuestion = async (req, res) => {
    try {
        const { question, answer, options, correctOption, tag, difficulty, explanation, isActive } = req.body;

        // Validate required fields
        if (!question) {
            return res.status(400).json({ message: 'Question is required' });
        }
        if (!answer) {
            return res.status(400).json({ message: 'Answer is required' });
        }
        if (!tag) {
            return res.status(400).json({ message: 'Tag is required' });
        }

        // Validate user ID from token
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User authentication required' });
        }

        // Validate options nếu được cung cấp
        if (options) {
            if (!options.A || !options.B || !options.C || !options.D) {
                return res.status(400).json({ message: 'If options are provided, all A, B, C, D must be filled' });
            }
        }

        // Validate correctOption nếu được cung cấp
        if (correctOption && !['A', 'B', 'C', 'D'].includes(correctOption)) {
            return res.status(400).json({ message: 'correctOption must be A, B, C, or D' });
        }

        // Nếu có options thì phải có correctOption và ngược lại
        if ((options && !correctOption) || (!options && correctOption)) {
            return res.status(400).json({ message: 'Options and correctOption must be provided together, or both omitted' });
        }

        // Validate tag
        const validTags = ['geometry', 'algebra', 'probability', 'calculus', 'statistics', 'other'];
        if (!validTags.includes(tag)) {
            return res.status(400).json({ message: `Tag must be one of: ${validTags.join(', ')}` });
        }

        // Validate difficulty if provided
        if (difficulty && !['easy', 'medium', 'hard'].includes(difficulty)) {
            return res.status(400).json({ message: 'Difficulty must be one of: easy, medium, hard' });
        }

        // Validate isActive if provided
        if (isActive !== undefined && typeof isActive !== 'boolean') {
            return res.status(400).json({ message: 'isActive must be a boolean' });
        }

        const questionData = {
            question,
            answer,
            tag,
            difficulty: difficulty || 'medium',
            created_by: req.user.id,
            isActive: isActive !== undefined ? isActive : true,
        };

        // Chỉ thêm options và correctOption nếu được cung cấp
        if (options && correctOption) {
            questionData.options = {
                A: options.A,
                B: options.B,
                C: options.C,
                D: options.D,
            };
            questionData.correctOption = correctOption;
        }

        // Thêm explanation nếu có
        if (explanation) {
            questionData.explanation = explanation;
        }

        const newQuestion = await Question.create(questionData);

        // Populate created_by for response
        await newQuestion.populate('created_by', 'name email role');

        res.status(201).json({ 
            message: 'Question created successfully', 
            question: newQuestion 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==================================================
// 🔹 GET ALL QUESTIONS (Teacher only)
// Có thể filter theo tag, difficulty, isActive
// ==================================================
export const getAllQuestions = async (req, res) => {
    try {
        const { tag, difficulty, isActive, search } = req.query;
        const teacherId = req.user.id;
        const userRole = req.user.role;

        // Build query
        const query = {};

        // Teacher chỉ thấy questions của mình, Admin thấy tất cả
        if (userRole !== 'Admin') {
            query.created_by = teacherId;
        }

        // Filter by tag
        if (tag) {
            const validTags = ['geometry', 'algebra', 'probability', 'calculus', 'statistics', 'other'];
            if (validTags.includes(tag)) {
                query.tag = tag;
            }
        }

        // Filter by difficulty
        if (difficulty) {
            const validDifficulties = ['easy', 'medium', 'hard'];
            if (validDifficulties.includes(difficulty)) {
                query.difficulty = difficulty;
            }
        }

        // Filter by isActive
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        // Search by question text
        if (search) {
            query.question = { $regex: search, $options: 'i' };
        }

        const questions = await Question.find(query)
            .populate('created_by', 'name email role')
            .sort({ created_at: -1 });

        res.json({
            message: 'Questions retrieved successfully',
            count: questions.length,
            questions,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==================================================
// 🔹 GET QUESTION BY ID
// ==================================================
export const getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;
        const teacherId = req.user.id;
        const userRole = req.user.role;

        const question = await Question.findById(id)
            .populate('created_by', 'name email role');

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Teacher chỉ có thể xem questions của mình, Admin có thể xem tất cả
        if (userRole !== 'Admin' && question.created_by._id.toString() !== teacherId) {
            return res.status(403).json({ message: 'You do not have permission to view this question' });
        }

        res.json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==================================================
// 🔹 GET MY QUESTIONS (Teacher only)
// Lấy tất cả questions của teacher hiện tại
// ==================================================
export const getMyQuestions = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const { tag, difficulty, isActive, search } = req.query;

        // Build query
        const query = { created_by: teacherId };

        // Filter by tag
        if (tag) {
            const validTags = ['geometry', 'algebra', 'probability', 'calculus', 'statistics', 'other'];
            if (validTags.includes(tag)) {
                query.tag = tag;
            }
        }

        // Filter by difficulty
        if (difficulty) {
            const validDifficulties = ['easy', 'medium', 'hard'];
            if (validDifficulties.includes(difficulty)) {
                query.difficulty = difficulty;
            }
        }

        // Filter by isActive
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        // Search by question text
        if (search) {
            query.question = { $regex: search, $options: 'i' };
        }

        const questions = await Question.find(query)
            .populate('created_by', 'name email role')
            .sort({ created_at: -1 });

        res.json({
            message: 'My questions retrieved successfully',
            count: questions.length,
            questions,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==================================================
// 🔹 UPDATE QUESTION (Teacher only)
// ==================================================
export const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer, options, correctOption, tag, difficulty, explanation, isActive } = req.body;
        const teacherId = req.user.id;
        const userRole = req.user.role;

        const questionDoc = await Question.findById(id);

        if (!questionDoc) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Chỉ người tạo hoặc admin mới được sửa
        if (questionDoc.created_by.toString() !== teacherId && userRole !== 'Admin') {
            return res.status(403).json({ message: 'You do not have permission to edit this question' });
        }

        // Validate tag if provided
        if (tag !== undefined) {
            const validTags = ['geometry', 'algebra', 'probability', 'calculus', 'statistics', 'other'];
            if (!validTags.includes(tag)) {
                return res.status(400).json({ message: `Tag must be one of: ${validTags.join(', ')}` });
            }
        }

        // Validate difficulty if provided
        if (difficulty !== undefined && !['easy', 'medium', 'hard'].includes(difficulty)) {
            return res.status(400).json({ message: 'Difficulty must be one of: easy, medium, hard' });
        }

        // Validate correctOption if provided
        if (correctOption !== undefined && !['A', 'B', 'C', 'D'].includes(correctOption)) {
            return res.status(400).json({ message: 'correctOption must be A, B, C, or D' });
        }

        // Validate options if provided
        if (options !== undefined) {
            if (!options.A || !options.B || !options.C || !options.D) {
                return res.status(400).json({ message: 'If options are provided, all A, B, C, D must be filled' });
            }
        }

        // Nếu có options thì phải có correctOption và ngược lại
        if ((options !== undefined && correctOption === undefined && !questionDoc.correctOption) || 
            (options === undefined && correctOption !== undefined && !questionDoc.options)) {
            return res.status(400).json({ message: 'Options and correctOption must be provided together' });
        }

        // Validate isActive if provided
        if (isActive !== undefined && typeof isActive !== 'boolean') {
            return res.status(400).json({ message: 'isActive must be a boolean' });
        }

        // Cập nhật các trường nếu có
        if (question !== undefined) questionDoc.question = question;
        if (answer !== undefined) questionDoc.answer = answer;
        if (tag !== undefined) questionDoc.tag = tag;
        if (difficulty !== undefined) questionDoc.difficulty = difficulty;
        if (explanation !== undefined) questionDoc.explanation = explanation;
        if (isActive !== undefined) questionDoc.isActive = isActive;
        if (correctOption !== undefined) questionDoc.correctOption = correctOption;
        if (options !== undefined) {
            questionDoc.options = {
                A: options.A,
                B: options.B,
                C: options.C,
                D: options.D,
            };
        }

        await questionDoc.save();

        // Populate for response
        await questionDoc.populate('created_by', 'name email role');

        res.json({ 
            message: 'Question updated successfully', 
            question: questionDoc 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==================================================
// 🔹 DELETE QUESTION (Teacher only)
// ==================================================
export const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const teacherId = req.user.id;
        const userRole = req.user.role;

        const question = await Question.findById(id);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Chỉ người tạo hoặc admin mới được xóa
        if (question.created_by.toString() !== teacherId && userRole !== 'Admin') {
            return res.status(403).json({ message: 'You do not have permission to delete this question' });
        }

        await question.deleteOne();

        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==================================================
// 🔹 BULK DELETE QUESTIONS (Teacher only)
// Xóa nhiều questions cùng lúc
// ==================================================
export const bulkDeleteQuestions = async (req, res) => {
    try {
        const { question_ids } = req.body;
        const teacherId = req.user.id;
        const userRole = req.user.role;

        if (!question_ids || !Array.isArray(question_ids) || question_ids.length === 0) {
            return res.status(400).json({ message: 'question_ids must be a non-empty array' });
        }

        // Build query
        const query = { _id: { $in: question_ids } };

        // Teacher chỉ có thể xóa questions của mình
        if (userRole !== 'Admin') {
            query.created_by = teacherId;
        }

        const result = await Question.deleteMany(query);

        if (result.deletedCount === 0) {
            return res.status(404).json({ 
                message: 'No questions were deleted. They may not exist or you do not have permission to delete them' 
            });
        }

        res.json({ 
            message: `${result.deletedCount} question(s) deleted successfully`,
            deleted_count: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

