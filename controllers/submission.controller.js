import Submission from '../models/submission.model.js';
import Exam from '../models/exam.model.js';

// Helper function: Shuffle array
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};


// START EXAM (Student) - Tạo submission mới khi student bắt đầu làm bài
export const startExam = async (req, res) => {
    try {
        const { examId } = req.params;
        const studentId = req.user.id;

        // Kiểm tra exam có tồn tại và public không
        const exam = await Exam.findById(examId)
            .populate('questions');
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        if (!exam.isPublic) {
            return res.status(403).json({ message: 'This exam is not public' });
        }

        if (!exam.questions || exam.questions.length === 0) {
            return res.status(400).json({ message: 'This exam has no questions' });
        }

        // Kiểm tra xem student đã có submission in_progress chưa
        const existingSubmission = await Submission.findOne({
            exam_id: examId,
            student_id: studentId,
            status: 'in_progress'
        });

        // Xử lý questions: dùng options và correctOption có sẵn
        const questionsWithOptions = [];
        for (const question of exam.questions) {
            // Questions đã có options và correctOption sẵn
            if (!question.options || !question.correctOption) {
                return res.status(400).json({ 
                    message: `Question ${question._id} is missing options or correctOption. Please ensure all questions have complete multiple choice options.` 
                });
            }
            questionsWithOptions.push({
                ...question.toObject(),
                generatedOptions: question.options,
                generatedCorrectOption: question.correctOption
            });
        }

        if (existingSubmission) {
            // Trả về submission đang có
            await existingSubmission.populate('exam_id', 'title description time_limit total_questions');
            
            // Trả về exam với questions (có options nhưng không có correctOption)
            const examWithItems = {
                _id: exam._id,
                title: exam.title,
                description: exam.description,
                time_limit: exam.time_limit,
                total_questions: exam.total_questions,
                questions: questionsWithOptions.map(item => ({
                    _id: item._id,
                    question: item.question,
                    tag: item.tag,
                    difficulty: item.difficulty,
                    options: item.generatedOptions, // Trả về 4 options, không trả về correctOption để student không thấy đáp án đúng
                }))
            };
            
            return res.json({
                message: 'You already have an ongoing exam submission',
                submission: existingSubmission,
                exam: examWithItems
            });
        }

        // Tạo submission mới
        const submission = await Submission.create({
            exam_id: examId,
            student_id: studentId,
            total_questions: exam.total_questions,
            answers: [],
            status: 'in_progress',
            started_at: new Date(),
        });

        // Populate submission
        await submission.populate('exam_id', 'title description time_limit total_questions');

        // Trả về exam với questions (có options nhưng không có correctOption)
        const examWithItems = {
            _id: exam._id,
            title: exam.title,
            description: exam.description,
            time_limit: exam.time_limit,
            total_questions: exam.total_questions,
            questions: questionsWithOptions.map(item => ({
                _id: item._id,
                question: item.question,
                tag: item.tag,
                difficulty: item.difficulty,
                options: item.generatedOptions, // Trả về 4 options, không trả về correctOption để student không thấy đáp án đúng
            }))
        };
        
        // Lưu generated options vào submission để dùng khi chấm điểm
        submission.generatedOptions = questionsWithOptions.map(item => ({
            question_id: item._id,
            options: item.generatedOptions,
            correctOption: item.generatedCorrectOption
        }));
        await submission.save();

        res.status(201).json({
            message: 'Exam started successfully',
            submission,
            exam: examWithItems
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// SUBMIT ANSWER (Student) - Lưu câu trả lời cho một question
export const submitAnswer = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { question_id, selected_option } = req.body;
        const studentId = req.user.id;

        // Validate required fields
        if (!question_id || !selected_option) {
            return res.status(400).json({ message: 'question_id and selected_option are required' });
        }

        // Validate selected_option
        if (!['A', 'B', 'C', 'D'].includes(selected_option)) {
            return res.status(400).json({ message: 'selected_option must be A, B, C, or D' });
        }

        // Kiểm tra submission
        const submission = await Submission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Kiểm tra quyền
        if (submission.student_id.toString() !== studentId) {
            return res.status(403).json({ message: 'You do not have permission to modify this submission' });
        }

        // Kiểm tra status
        if (submission.status !== 'in_progress') {
            return res.status(400).json({ message: 'This submission is already submitted or expired' });
        }

        // Kiểm tra thời gian
        const exam = await Exam.findById(submission.exam_id);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        const timeSpent = Math.floor((new Date() - submission.started_at) / 1000 / 60); // minutes
        if (timeSpent > exam.time_limit) {
            submission.status = 'expired';
            await submission.save();
            return res.status(400).json({ message: 'Time limit exceeded. Exam has expired.' });
        }

        // Kiểm tra xem question có trong exam không
        const examQuestions = exam.questions ? exam.questions.map(id => id.toString()) : [];
        if (!examQuestions.includes(question_id.toString())) {
            return res.status(400).json({ message: 'This question is not in the exam' });
        }

        // Lấy correctOption từ generatedOptions
        let correctOption;
        if (submission.generatedOptions && submission.generatedOptions.length > 0) {
            const generatedOption = submission.generatedOptions.find(opt => 
                opt.question_id && opt.question_id.toString() === question_id.toString()
            );
            if (generatedOption) {
                correctOption = generatedOption.correctOption;
            }
        }

        // Nếu không có trong generatedOptions, cần restart exam
        if (!correctOption) {
            return res.status(400).json({ message: 'Unable to determine correct option. Please restart the exam.' });
        }

        // Kiểm tra xem đã trả lời question này chưa
        const existingAnswer = submission.answers.find(answer => 
            answer.question_id && answer.question_id.toString() === question_id.toString()
        );

        const isCorrect = selected_option === correctOption;

        if (existingAnswer) {
            // Cập nhật câu trả lời cũ
            existingAnswer.selected_option = selected_option;
            existingAnswer.correct_option = correctOption;
            existingAnswer.is_correct = isCorrect;
            existingAnswer.answered_at = new Date();
        } else {
            // Thêm câu trả lời mới
            submission.answers.push({
                question_id,
                selected_option,
                correct_option: correctOption,
                is_correct: isCorrect,
                answered_at: new Date(),
            });
        }

        await submission.save();

        res.json({
            message: 'Answer submitted successfully',
            submission: await Submission.findById(submissionId).populate('exam_id'),
            is_correct: isCorrect
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// FINISH EXAM (Student) - Nộp bài và tính điểm
export const finishExam = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const studentId = req.user.id;

        // Kiểm tra submission
        const submission = await Submission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Kiểm tra quyền
        if (submission.student_id.toString() !== studentId) {
            return res.status(403).json({ message: 'You do not have permission to finish this submission' });
        }

        // Kiểm tra status
        if (submission.status !== 'in_progress') {
            return res.status(400).json({ message: 'This submission is already submitted or expired' });
        }

        // Lấy thông tin exam để đảm bảo tính điểm chính xác
        const exam = await Exam.findById(submission.exam_id).populate('questions');
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Đảm bảo tất cả câu trả lời đã được chấm điểm tự động
        // Kiểm tra lại từng câu trả lời để đảm bảo is_correct chính xác
        for (let answer of submission.answers) {
            // Lấy correctOption từ generatedOptions
            let correctOption;
            if (submission.generatedOptions && submission.generatedOptions.length > 0) {
                const generatedOption = submission.generatedOptions.find(opt => 
                    opt.question_id && opt.question_id.toString() === answer.question_id.toString()
                );
                if (generatedOption) {
                    correctOption = generatedOption.correctOption;
                }
            }
            
            // Tự động chấm điểm: so sánh selected_option với correctOption
            if (correctOption) {
                answer.is_correct = answer.selected_option === correctOption;
                answer.correct_option = correctOption;
            }
        }

        // Tính điểm tự động
        const correctAnswers = submission.answers.filter(answer => answer.is_correct).length;
        const totalQuestions = exam.total_questions || submission.total_questions || submission.answers.length;
        const answeredQuestions = submission.answers.length;
        const unansweredQuestions = totalQuestions - answeredQuestions;
        
        // Tính điểm: (số câu đúng / tổng số câu) * 100, làm tròn 2 chữ số thập phân
        const score = totalQuestions > 0 
            ? Math.round((correctAnswers / totalQuestions) * 100 * 100) / 100
            : 0;

        // Tính thời gian làm bài (minutes)
        const timeSpent = Math.floor((new Date() - submission.started_at) / 1000 / 60);

        // Cập nhật submission
        submission.status = 'submitted';
        submission.submitted_at = new Date();
        submission.correct_answers = correctAnswers;
        submission.score = score;
        submission.time_spent = timeSpent;
        submission.total_questions = totalQuestions; // Đảm bảo total_questions đúng

        await submission.save();

        // Populate để trả về đầy đủ thông tin
        await submission.populate('exam_id', 'title description time_limit');
        await submission.populate('answers.question_id', 'question answer tag difficulty');

        // Tạo danh sách chi tiết từng câu hỏi và kết quả
        const detailedResults = submission.answers.map(answer => {
            // Lấy options từ generatedOptions
            let options;
            if (submission.generatedOptions && submission.generatedOptions.length > 0) {
                const generatedOption = submission.generatedOptions.find(opt => 
                    opt.question_id && opt.question_id.toString() === answer.question_id._id.toString()
                );
                if (generatedOption) {
                    options = generatedOption.options;
                }
            }
            
            return {
                question_id: answer.question_id._id,
                question: answer.question_id.question,
                options: options || {},
                selected_option: answer.selected_option,
                correct_option: answer.correct_option,
                is_correct: answer.is_correct,
                correct_answer_text: options ? options[answer.correct_option] : answer.question_id.answer,
                selected_answer_text: options ? options[answer.selected_option] : answer.selected_option,
            };
        });

        res.json({
            message: 'Exam submitted and graded successfully',
            submission,
            grading_result: {
                total_questions: totalQuestions,
                answered: answeredQuestions,
                unanswered: unansweredQuestions,
                correct_answers: correctAnswers,
                incorrect_answers: answeredQuestions - correctAnswers,
                score: score,
                percentage: `${score}%`,
                time_spent: timeSpent,
                time_limit: exam.time_limit,
            },
            detailed_results: detailedResults
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SUBMISSION (Student) - Xem chi tiết submission
export const getSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const studentId = req.user.id;

        const submission = await Submission.findById(submissionId)
            .populate('exam_id', 'title description time_limit total_questions created_by')
            .populate('answers.question_id', 'question answer tag difficulty')
            .populate('student_id', 'name email');

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Kiểm tra quyền - student chỉ xem được submission của mình
        if (submission.student_id._id.toString() !== studentId && req.user.role !== 'Admin' && req.user.role !== 'Teacher') {
            return res.status(403).json({ message: 'You do not have permission to view this submission' });
        }

        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET MY SUBMISSIONS (Student) - Xem lịch sử làm bài của student
export const getMySubmissions = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { examId, status } = req.query;

        const query = { student_id: studentId };
        if (examId) query.exam_id = examId;
        if (status) query.status = status;

        const submissions = await Submission.find(query)
            .populate('exam_id', 'title description time_limit total_questions')
            .sort({ started_at: -1 });

        res.json({
            message: 'My submissions retrieved successfully',
            submissions,
            total: submissions.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET MY COMPLETED TESTS (Student) - Xem các test đã hoàn thành (status = 'submitted')
export const getMyCompletedTests = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { examId } = req.query;

        // Chỉ lấy các submissions đã hoàn thành
        const query = { 
            student_id: studentId,
            status: 'submitted'
        };
        
        if (examId) {
            query.exam_id = examId;
        }

        const submissions = await Submission.find(query)
            .populate('exam_id', 'title description time_limit total_questions created_by')
            .populate('answers.question_id', 'question answer tag difficulty')
            .sort({ submitted_at: -1 });

        // Tính toán thống kê
        const stats = {
            total_completed: submissions.length,
            average_score: submissions.length > 0
                ? Math.round((submissions.reduce((sum, s) => sum + s.score, 0) / submissions.length) * 100) / 100
                : 0,
            total_questions_answered: submissions.reduce((sum, s) => sum + s.total_questions, 0),
            total_correct_answers: submissions.reduce((sum, s) => sum + s.correct_answers, 0),
        };

        // Format kết quả để dễ đọc hơn
        const formattedResults = submissions.map(submission => ({
            _id: submission._id,
            exam: {
                _id: submission.exam_id._id,
                title: submission.exam_id.title,
                description: submission.exam_id.description,
                time_limit: submission.exam_id.time_limit,
                total_questions: submission.exam_id.total_questions,
            },
            score: submission.score,
            total_questions: submission.total_questions,
            correct_answers: submission.correct_answers,
            incorrect_answers: submission.total_questions - submission.correct_answers,
            time_spent: submission.time_spent,
            submitted_at: submission.submitted_at,
            started_at: submission.started_at,
            // Chi tiết từng câu hỏi
            answers: submission.answers.map(answer => {
                // Lấy options từ generatedOptions
                let options = {};
                if (submission.generatedOptions && submission.generatedOptions.length > 0) {
                    const generatedOption = submission.generatedOptions.find(opt => 
                        opt.question_id && opt.question_id.toString() === answer.question_id._id.toString()
                    );
                    if (generatedOption) {
                        options = generatedOption.options;
                    }
                }
                
                return {
                    question_id: answer.question_id._id,
                    question: answer.question_id.question,
                    tag: answer.question_id.tag,
                    difficulty: answer.question_id.difficulty,
                    options: options,
                    selected_option: answer.selected_option,
                    correct_option: answer.correct_option,
                    is_correct: answer.is_correct,
                    selected_answer_text: options[answer.selected_option] || answer.selected_option,
                    correct_answer_text: options[answer.correct_option] || answer.question_id.answer,
                };
            })
        }));

        res.json({
            message: 'My completed tests retrieved successfully',
            results: formattedResults,
            statistics: stats,
            total: submissions.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SUBMISSION BY EXAM (Student) - Lấy submission của student cho một exam cụ thể
export const getSubmissionByExam = async (req, res) => {
    try {
        const { examId } = req.params;
        const studentId = req.user.id;

        const submission = await Submission.findOne({
            exam_id: examId,
            student_id: studentId
        })
        .populate('exam_id', 'title description time_limit total_questions')
        .populate('answers.question_id', 'question answer tag difficulty')
        .sort({ started_at: -1 });

        if (!submission) {
            return res.status(404).json({ message: 'No submission found for this exam' });
        }

        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ALL SUBMISSIONS (Teacher/Admin) - Xem tất cả submissions với filter options
export const getAllSubmissions = async (req, res) => {
    try {
        const { examId, studentId, status, sortBy = 'started_at', sortOrder = 'desc' } = req.query;
        const userRole = req.user?.role;

        // Chỉ Teacher và Admin mới được xem tất cả submissions
        if (!['Teacher', 'Admin'].includes(userRole)) {
            return res.status(403).json({ message: 'Access denied. Teacher or Admin role required' });
        }

        // Build query
        const query = {};
        
        if (examId) {
            query.exam_id = examId;
        }
        
        if (studentId) {
            query.student_id = studentId;
        }
        
        if (status) {
            if (!['in_progress', 'submitted', 'expired'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status. Must be: in_progress, submitted, or expired' });
            }
            query.status = status;
        }

        // Sort options
        const sortOptions = {};
        const validSortFields = ['started_at', 'submitted_at', 'score', 'correct_answers'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'started_at';
        const order = sortOrder === 'asc' ? 1 : -1;
        sortOptions[sortField] = order;

        // Find submissions
        const submissions = await Submission.find(query)
            .populate('exam_id', 'title description time_limit total_questions created_by')
            .populate('student_id', 'name email')
            .sort(sortOptions);

        // Calculate statistics
        const stats = {
            total: submissions.length,
            in_progress: submissions.filter(s => s.status === 'in_progress').length,
            submitted: submissions.filter(s => s.status === 'submitted').length,
            expired: submissions.filter(s => s.status === 'expired').length,
            average_score: submissions.length > 0 && submissions.filter(s => s.status === 'submitted').length > 0
                ? Math.round((submissions.filter(s => s.status === 'submitted').reduce((sum, s) => sum + s.score, 0) / submissions.filter(s => s.status === 'submitted').length) * 100) / 100
                : 0,
        };

        res.json({
            message: 'All submissions retrieved successfully',
            submissions,
            statistics: stats,
            filters: {
                examId: examId || null,
                studentId: studentId || null,
                status: status || null,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

