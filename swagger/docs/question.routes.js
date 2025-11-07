/**
 * @swagger
 * /api/question/teacher/create:
 *   post:
 *     summary: Create a new question in question bank (Teacher/Admin only)
 *     description: Tạo câu hỏi mới trong question bank. Questions phải có đầy đủ options (A, B, C, D) và correctOption.
 *     tags: [Question Bank]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - answer
 *               - tag
 *             properties:
 *               question:
 *                 type: string
 *                 description: Question text
 *               answer:
 *                 type: string
 *                 description: Answer text
 *               options:
 *                 type: object
 *                 description: Multiple choice options (A, B, C, D) - required if correctOption is provided
 *                 properties:
 *                   A: { type: string }
 *                   B: { type: string }
 *                   C: { type: string }
 *                   D: { type: string }
 *               correctOption:
 *                 type: string
 *                 enum: [A, B, C, D]
 *                 description: Correct option - required if options is provided
 *               tag:
 *                 type: string
 *                 enum: [geometry, algebra, probability, calculus, statistics, other]
 *                 description: Question category tag
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 default: medium
 *                 description: Difficulty level
 *               explanation:
 *                 type: string
 *                 description: Explanation for the answer (optional)
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 description: Whether question is active
 *     responses:
 *       201:
 *         description: Question created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 question:
 *                   $ref: '#/components/schemas/Question'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/question/teacher/all:
 *   get:
 *     summary: Get all questions (Teacher/Admin only)
 *     description: Lấy tất cả questions. Teacher chỉ thấy questions của mình, Admin thấy tất cả. Có thể filter theo tag, difficulty, isActive, search.
 *     tags: [Question Bank]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *           enum: [geometry, algebra, probability, calculus, statistics, other]
 *         description: Filter by tag
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *         description: Filter by difficulty
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by question text
 *     responses:
 *       200:
 *         description: List of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 count:
 *                   type: number
 *                 questions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 */

/**
 * @swagger
 * /api/question/teacher/my-questions:
 *   get:
 *     summary: Get my questions (Teacher/Admin only)
 *     description: Lấy tất cả questions của teacher hiện tại. Có thể filter theo tag, difficulty, isActive, search.
 *     tags: [Question Bank]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *           enum: [geometry, algebra, probability, calculus, statistics, other]
 *         description: Filter by tag
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *         description: Filter by difficulty
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by question text
 *     responses:
 *       200:
 *         description: List of my questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 count:
 *                   type: number
 *                 questions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 */

/**
 * @swagger
 * /api/question/teacher/{id}:
 *   get:
 *     summary: Get question by ID (Teacher/Admin only)
 *     tags: [Question Bank]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Question details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       403:
 *         description: Access denied
 *       404:
 *         description: Question not found
 */

/**
 * @swagger
 * /api/question/teacher/update/{id}:
 *   put:
 *     summary: Update question (Teacher/Admin only)
 *     tags: [Question Bank]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *               options:
 *                 type: object
 *                 properties:
 *                   A: { type: string }
 *                   B: { type: string }
 *                   C: { type: string }
 *                   D: { type: string }
 *               correctOption:
 *                 type: string
 *                 enum: [A, B, C, D]
 *               tag:
 *                 type: string
 *                 enum: [geometry, algebra, probability, calculus, statistics, other]
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *               explanation:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Question updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 question:
 *                   $ref: '#/components/schemas/Question'
 *       403:
 *         description: Access denied
 *       404:
 *         description: Question not found
 */

/**
 * @swagger
 * /api/question/teacher/delete/{id}:
 *   delete:
 *     summary: Delete question (Teacher/Admin only)
 *     tags: [Question Bank]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Question not found
 */

/**
 * @swagger
 * /api/question/teacher/bulk-delete:
 *   post:
 *     summary: Bulk delete questions (Teacher/Admin only)
 *     description: Xóa nhiều questions cùng lúc
 *     tags: [Question Bank]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question_ids
 *             properties:
 *               question_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of question IDs to delete
 *     responses:
 *       200:
 *         description: Questions deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deleted_count:
 *                   type: number
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/question/admin/all:
 *   get:
 *     summary: Get all questions (Admin only)
 *     tags: [Question Bank]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 count:
 *                   type: number
 *                 questions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 */

/**
 * @swagger
 * /api/question/admin/delete/{id}:
 *   delete:
 *     summary: Delete question (Admin only)
 *     tags: [Question Bank]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *       404:
 *         description: Question not found
 */

