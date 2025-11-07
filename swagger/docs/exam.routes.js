/**
 * @swagger
 * /api/exam/all:
 *   get:
 *     summary: Get all exams
 *     description: Student chỉ thấy public exams, Teacher/Admin thấy tất cả
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of exams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exam'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/exam/all/{id}:
 *   get:
 *     summary: Get exam by ID
 *     description: Student chỉ có thể xem public exams
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     responses:
 *       200:
 *         description: Exam details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exam'
 *       403:
 *         description: Access denied - Exam is not public
 *       404:
 *         description: Exam not found
 */

/**
 * @swagger
 * /api/exam/teacher/create:
 *   post:
 *     summary: Create a new exam (Teacher/Admin only)
 *     description: Tạo exam mới từ questions trong question bank. Questions phải có đầy đủ options và correctOption.
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - questions
 *             properties:
 *               title:
 *                 type: string
 *                 description: Exam title
 *               description:
 *                 type: string
 *                 description: Exam description
 *               questions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of question IDs from question bank
 *               time_limit:
 *                 type: number
 *                 default: 60
 *                 description: Time limit in minutes
 *               isPublic:
 *                 type: boolean
 *                 default: false
 *                 description: Whether exam is public
 *     responses:
 *       201:
 *         description: Exam created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 exam:
 *                   $ref: '#/components/schemas/Exam'
 *       400:
 *         description: Validation error - questions array is required or invalid question IDs
 *       403:
 *         description: Access denied - can only use questions from your question bank
 */

/**
 * @swagger
 * /api/exam/teacher/my-exams:
 *   get:
 *     summary: Get my exams (Teacher/Admin only)
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of exams created by the teacher
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 exams:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Exam'
 *                 total:
 *                   type: number
 */

/**
 * @swagger
 * /api/exam/teacher/update/{id}:
 *   put:
 *     summary: Update exam (Teacher/Admin only)
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               time_limit:
 *                 type: number
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Exam updated successfully
 */

/**
 * @swagger
 * /api/exam/teacher/delete/{id}:
 *   delete:
 *     summary: Delete exam (Teacher/Admin only)
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     responses:
 *       200:
 *         description: Exam deleted successfully
 */

/**
 * @swagger
 * /api/exam/teacher/{id}/add-questions:
 *   post:
 *     summary: Add questions to exam (Teacher/Admin only)
 *     description: Thêm questions từ question bank vào exam
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
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
 *                 description: Array of question IDs from question bank to add
 *     responses:
 *       200:
 *         description: Questions added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 exam:
 *                   $ref: '#/components/schemas/Exam'
 *                 added_count:
 *                   type: number
 *       400:
 *         description: Invalid question IDs or questions already in exam
 *       403:
 *         description: Access denied - can only use questions from your question bank
 */

/**
 * @swagger
 * /api/exam/teacher/{id}/remove-questions:
 *   post:
 *     summary: Remove questions from exam (Teacher/Admin only)
 *     description: Xóa questions khỏi exam
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
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
 *                 description: Array of question IDs to remove
 *     responses:
 *       200:
 *         description: Questions removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 exam:
 *                   $ref: '#/components/schemas/Exam'
 *                 removed_count:
 *                   type: number
 *       400:
 *         description: No questions were removed
 */


