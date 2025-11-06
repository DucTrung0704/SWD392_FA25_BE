/**
 * @swagger
 * /api/submission/student/start/{examId}:
 *   post:
 *     summary: Start an exam (Student)
 *     description: Bắt đầu làm bài. Hệ thống tự động generate 4 options (A, B, C, D) cho mỗi flashcard từ các flashcards khác trong exam.
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     responses:
 *       201:
 *         description: Exam started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 submission:
 *                   $ref: '#/components/schemas/Submission'
 *                 exam:
 *                   type: object
 *                   properties:
 *                     flashcards:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           question:
 *                             type: string
 *                           options:
 *                             type: object
 *                             properties:
 *                               A: { type: string }
 *                               B: { type: string }
 *                               C: { type: string }
 *                               D: { type: string }
 *       403:
 *         description: Exam is not public
 *       404:
 *         description: Exam not found
 */

/**
 * @swagger
 * /api/submission/student/submit-answer/{submissionId}:
 *   post:
 *     summary: Submit answer for a flashcard (Student)
 *     description: Nộp câu trả lời cho một flashcard. selected_option phải là A, B, C, hoặc D.
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Submission ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - flashcard_id
 *               - selected_option
 *             properties:
 *               flashcard_id:
 *                 type: string
 *                 description: Flashcard ID
 *               selected_option:
 *                 type: string
 *                 enum: [A, B, C, D]
 *                 description: Selected option
 *     responses:
 *       200:
 *         description: Answer submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 is_correct:
 *                   type: boolean
 *       400:
 *         description: Invalid input or time limit exceeded
 */

/**
 * @swagger
 * /api/submission/student/finish/{submissionId}:
 *   post:
 *     summary: Finish exam and get results (Student)
 *     description: Nộp bài và tự động chấm điểm. Hệ thống sẽ tự động tính điểm và trả về kết quả chi tiết.
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Submission ID
 *     responses:
 *       200:
 *         description: Exam submitted and graded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 submission:
 *                   $ref: '#/components/schemas/Submission'
 *                 grading_result:
 *                   type: object
 *                   properties:
 *                     total_questions:
 *                       type: number
 *                     answered:
 *                       type: number
 *                     correct_answers:
 *                       type: number
 *                     score:
 *                       type: number
 *                     percentage:
 *                       type: string
 *                     time_spent:
 *                       type: number
 *                 detailed_results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       flashcard_id:
 *                         type: string
 *                       question:
 *                         type: string
 *                       options:
 *                         type: object
 *                       selected_option:
 *                         type: string
 *                       correct_option:
 *                         type: string
 *                       is_correct:
 *                         type: boolean
 */

/**
 * @swagger
 * /api/submission/student/{submissionId}:
 *   get:
 *     summary: Get submission details (Student)
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Submission ID
 *     responses:
 *       200:
 *         description: Submission details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Submission'
 */

/**
 * @swagger
 * /api/submission/student/my-submissions:
 *   get:
 *     summary: Get my submissions (Student)
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: examId
 *         schema:
 *           type: string
 *         description: Filter by exam ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [in_progress, submitted, expired]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 submissions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Submission'
 *                 total:
 *                   type: number
 */

/**
 * @swagger
 * /api/submission/student/completed-tests:
 *   get:
 *     summary: Get all completed tests (Student only)
 *     description: Xem tất cả các test đã hoàn thành (status = 'submitted') của student. Trả về chi tiết đầy đủ bao gồm từng câu hỏi, đáp án đã chọn, đáp án đúng, và thống kê.
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: examId
 *         schema:
 *           type: string
 *         description: Optional - Filter by exam ID
 *     responses:
 *       200:
 *         description: List of completed tests with detailed results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       exam:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           description:
 *                             type: string
 *                           time_limit:
 *                             type: number
 *                           total_questions:
 *                             type: number
 *                       score:
 *                         type: number
 *                       total_questions:
 *                         type: number
 *                       correct_answers:
 *                         type: number
 *                       incorrect_answers:
 *                         type: number
 *                       time_spent:
 *                         type: number
 *                       submitted_at:
 *                         type: string
 *                         format: date-time
 *                       started_at:
 *                         type: string
 *                         format: date-time
 *                       answers:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             flashcard_id:
 *                               type: string
 *                             question:
 *                               type: string
 *                             tag:
 *                               type: string
 *                             options:
 *                               type: object
 *                             selected_option:
 *                               type: string
 *                             correct_option:
 *                               type: string
 *                             is_correct:
 *                               type: boolean
 *                             selected_answer_text:
 *                               type: string
 *                             correct_answer_text:
 *                               type: string
 *                 statistics:
 *                   type: object
 *                   properties:
 *                     total_completed:
 *                       type: number
 *                     average_score:
 *                       type: number
 *                     total_questions_answered:
 *                       type: number
 *                     total_correct_answers:
 *                       type: number
 *                 total:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Student access only
 */

/**
 * @swagger
 * /api/submission/student/exam/{examId}:
 *   get:
 *     summary: Get submission by exam (Student)
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     responses:
 *       200:
 *         description: Submission for the exam
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Submission'
 */

/**
 * @swagger
 * /api/submission/teacher/all:
 *   get:
 *     summary: Get all submissions (Teacher/Admin only)
 *     description: Xem tất cả submissions với filter options và statistics
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: examId
 *         schema:
 *           type: string
 *         description: Filter by exam ID
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: string
 *         description: Filter by student ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [in_progress, submitted, expired]
 *         description: Filter by status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [started_at, submitted_at, score, correct_answers]
 *           default: started_at
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of all submissions with statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 submissions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Submission'
 *                 statistics:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     in_progress:
 *                       type: number
 *                     submitted:
 *                       type: number
 *                     expired:
 *                       type: number
 *                     average_score:
 *                       type: number
 */


