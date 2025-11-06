import Class from '../models/class.model.js';
import User from '../models/user.model.js';
import Exam from '../models/exam.model.js';
import Submission from '../models/submission.model.js';

// CREATE CLASS (Teacher only)
export const createClass = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validate required fields
        if (!name) {
            return res.status(400).json({ message: 'Class name is required' });
        }

        // Validate user ID from token
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User authentication required' });
        }

        // Verify user is Teacher
        if (req.user.role !== 'Teacher' && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Only teachers can create classes' });
        }

        const newClass = await Class.create({
            name,
            description: description || '',
            teacher_id: req.user.id,
            students: [],
            exams: []
        });

        // Populate teacher for response
        await newClass.populate('teacher_id', 'name email role');

        res.status(201).json({ 
            message: 'Class created successfully', 
            class: newClass 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ALL CLASSES - Chỉ Admin mới có thể xem tất cả classes, Student: xem classes đã join
export const getAllClasses = async (req, res) => {
    try {
        const userRole = req.user?.role;
        const userId = req.user?.id;

        let query = {};

        if (userRole === 'Admin') {
            // Admin thấy tất cả classes
            query = {};
        } else if (userRole === 'Student') {
            // Student chỉ thấy classes đã join
            query = { students: userId, isActive: true };
        } else {
            // Teacher không nên gọi endpoint này, chỉ dùng my-classes
            return res.status(403).json({ 
                message: 'Access denied. Teachers should use /my-classes endpoint to view their classes' 
            });
        }

        const classes = await Class.find(query)
            .populate('teacher_id', 'name email role')
            .populate('students', 'name email role')
            .populate('exams', 'title description time_limit total_questions')
            .sort({ created_at: -1 });

        res.json({
            message: 'Classes retrieved successfully',
            classes,
            total: classes.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET CLASS BY ID
export const getClassById = async (req, res) => {
    try {
        const classId = req.params.id;
        const userRole = req.user?.role;
        const userId = req.user?.id;

        const classData = await Class.findById(classId)
            .populate('teacher_id', 'name email role')
            .populate('students', 'name email role avatar')
            .populate('exams', 'title description time_limit total_questions created_by');

        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Check permissions
        if (userRole === 'Student') {
            // Student chỉ có thể xem class nếu đã join
            if (!classData.students.some(s => s._id.toString() === userId)) {
                return res.status(403).json({ message: 'You are not a member of this class' });
            }
        } else if (userRole === 'Teacher') {
            // Teacher chỉ có thể xem class của mình
            if (classData.teacher_id._id.toString() !== userId) {
                return res.status(403).json({ message: 'You do not have permission to view this class' });
            }
        }

        res.json({
            message: 'Class retrieved successfully',
            class: classData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE CLASS (Teacher only)
export const updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, isActive } = req.body;

        const classData = await Class.findById(id);
        
        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Chỉ teacher của class hoặc admin mới được sửa
        if (classData.teacher_id.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You do not have permission to edit this class' });
        }

        // Update fields if provided
        if (name !== undefined) classData.name = name;
        if (description !== undefined) classData.description = description;
        if (isActive !== undefined) classData.isActive = isActive;

        await classData.save();

        // Populate for response
        await classData.populate('teacher_id', 'name email role');
        await classData.populate('students', 'name email role');
        await classData.populate('exams', 'title description time_limit total_questions');

        res.json({ 
            message: 'Class updated successfully', 
            class: classData 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE CLASS (Teacher only)
export const deleteClass = async (req, res) => {
    try {
        const { id } = req.params;
        const classData = await Class.findById(id);
        
        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Chỉ teacher của class hoặc admin mới được xóa
        if (classData.teacher_id.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You do not have permission to delete this class' });
        }

        await classData.deleteOne();
        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// JOIN CLASS BY CODE (Student) - Student sử dụng class_code để join class
export const joinClassByCode = async (req, res) => {
    try {
        const { class_code } = req.body;
        const studentId = req.user.id;

        if (!class_code) {
            return res.status(400).json({ message: 'Class code is required' });
        }

        // Verify user is Student
        if (req.user.role !== 'Student') {
            return res.status(403).json({ message: 'Only students can join classes' });
        }

        // Find class by code
        const classData = await Class.findOne({ 
            class_code: class_code.toUpperCase().trim(),
            isActive: true
        });

        if (!classData) {
            return res.status(404).json({ message: 'Invalid class code or class is inactive' });
        }

        // Check if student already in class
        if (classData.students.some(s => s.toString() === studentId)) {
            return res.status(400).json({ message: 'You are already a member of this class' });
        }

        // Add student to class
        classData.students.push(studentId);
        await classData.save();

        // Populate for response
        await classData.populate('teacher_id', 'name email role');
        await classData.populate('students', 'name email role');
        await classData.populate('exams', 'title description time_limit total_questions');

        res.json({ 
            message: 'Successfully joined class', 
            class: classData 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// REMOVE STUDENT FROM CLASS - Teacher có thể remove student, Student có thể leave class
export const removeStudentFromClass = async (req, res) => {
    try {
        const { id: classId } = req.params;
        const { student_id } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        const classData = await Class.findById(classId);
        
        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Determine which student to remove
        let targetStudentId = student_id;

        if (userRole === 'Student') {
            // Student can only leave themselves
            targetStudentId = userId;
        } else if (userRole === 'Teacher' || userRole === 'Admin') {
            // Teacher/Admin can remove any student, but must provide student_id
            if (!targetStudentId) {
                return res.status(400).json({ message: 'student_id is required' });
            }
            // Verify teacher owns the class
            if (userRole === 'Teacher' && classData.teacher_id.toString() !== userId) {
                return res.status(403).json({ message: 'You do not have permission to remove students from this class' });
            }
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Check if student is in class
        if (!classData.students.some(s => s.toString() === targetStudentId)) {
            return res.status(400).json({ message: 'Student is not a member of this class' });
        }

        // Remove student
        classData.students = classData.students.filter(s => s.toString() !== targetStudentId);
        await classData.save();

        // Populate for response
        await classData.populate('teacher_id', 'name email role');
        await classData.populate('students', 'name email role');
        await classData.populate('exams', 'title description time_limit total_questions');

        res.json({ 
            message: 'Student removed from class successfully', 
            class: classData 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADD EXAM TO CLASS (Teacher only)
export const addExamToClass = async (req, res) => {
    try {
        const { id: classId } = req.params;
        const { exam_id } = req.body;

        if (!exam_id) {
            return res.status(400).json({ message: 'exam_id is required' });
        }

        const classData = await Class.findById(classId);
        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Verify teacher owns the class
        if (classData.teacher_id.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You do not have permission to modify this class' });
        }

        // Verify exam exists
        const exam = await Exam.findById(exam_id);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Check if exam already in class
        if (classData.exams.some(e => e.toString() === exam_id)) {
            return res.status(400).json({ message: 'Exam is already in this class' });
        }

        // Add exam to class
        classData.exams.push(exam_id);
        await classData.save();

        // Populate for response
        await classData.populate('teacher_id', 'name email role');
        await classData.populate('students', 'name email role');
        await classData.populate('exams', 'title description time_limit total_questions created_by');

        res.json({ 
            message: 'Exam added to class successfully', 
            class: classData 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// REMOVE EXAM FROM CLASS (Teacher only)
export const removeExamFromClass = async (req, res) => {
    try {
        const { id: classId } = req.params;
        const { exam_id } = req.body;

        if (!exam_id) {
            return res.status(400).json({ message: 'exam_id is required' });
        }

        const classData = await Class.findById(classId);
        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Verify teacher owns the class
        if (classData.teacher_id.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You do not have permission to modify this class' });
        }

        // Check if exam is in class
        if (!classData.exams.some(e => e.toString() === exam_id)) {
            return res.status(400).json({ message: 'Exam is not in this class' });
        }

        // Remove exam
        classData.exams = classData.exams.filter(e => e.toString() !== exam_id);
        await classData.save();

        // Populate for response
        await classData.populate('teacher_id', 'name email role');
        await classData.populate('students', 'name email role');
        await classData.populate('exams', 'title description time_limit total_questions created_by');

        res.json({ 
            message: 'Exam removed from class successfully', 
            class: classData 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET CLASS SUBMISSIONS (Teacher only) - Teacher xem tất cả submissions của students trong class
export const getClassSubmissions = async (req, res) => {
    try {
        const { id: classId } = req.params;
        const { exam_id } = req.query; // Optional: filter by exam

        const classData = await Class.findById(classId);
        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Verify teacher owns the class
        if (classData.teacher_id.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You do not have permission to view submissions for this class' });
        }

        // Get all student IDs in class
        const studentIds = classData.students.map(s => s.toString());

        // Build query
        const query = { student_id: { $in: studentIds } };
        if (exam_id) {
            // If exam_id provided, only show submissions for that exam
            query.exam_id = exam_id;
            // Also verify exam is in class
            if (!classData.exams.some(e => e.toString() === exam_id)) {
                return res.status(400).json({ message: 'This exam is not in this class' });
            }
        } else {
            // If no exam_id, show submissions for all exams in class
            query.exam_id = { $in: classData.exams.map(e => e.toString()) };
        }

        // Get submissions
        const submissions = await Submission.find(query)
            .populate('exam_id', 'title description time_limit total_questions')
            .populate('student_id', 'name email role avatar')
            .sort({ submitted_at: -1, created_at: -1 });

        // Get exam details if filtering by exam
        let examDetails = null;
        if (exam_id) {
            examDetails = await Exam.findById(exam_id)
                .populate('created_by', 'name email')
                .populate('flashcards');
        }

        res.json({
            message: 'Submissions retrieved successfully',
            class_id: classId,
            exam_id: exam_id || null,
            exam: examDetails,
            submissions,
            total: submissions.length,
            total_students: studentIds.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET MY CLASSES (Teacher/Student) - Teacher: classes của mình, Student: classes đã join
export const getMyClasses = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        let query = {};

        if (userRole === 'Teacher') {
            query = { teacher_id: userId };
        } else if (userRole === 'Student') {
            query = { students: userId, isActive: true };
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }

        const classes = await Class.find(query)
            .populate('teacher_id', 'name email role')
            .populate('students', 'name email role')
            .populate('exams', 'title description time_limit total_questions')
            .sort({ created_at: -1 });

        res.json({
            message: 'My classes retrieved successfully',
            classes,
            total: classes.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

