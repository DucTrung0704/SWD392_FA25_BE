/**
 * @swagger
 * /api/flashcard/student/deck/{deckId}:
 *   get:
 *     summary: Get flashcards by deck ID (Student access)
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         schema:
 *           type: string
 *         description: Deck ID
 *     responses:
 *       200:
 *         description: Flashcards in the deck
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 flashcards:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flashcard'
 *       404:
 *         description: Deck not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/flashcard/teacher/all:
 *   get:
 *     summary: Get all flashcards (Teacher/Admin access)
 *     description: Teacher và Admin có thể xem tất cả flashcards trong hệ thống để quản lý và CRUD
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all flashcards
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *                   description: Total number of flashcards
 *                 flashcards:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flashcard'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Teacher/Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/flashcard/teacher/my-flashcards:
 *   get:
 *     summary: Get my flashcards (Teacher/Admin only)
 *     description: Lấy tất cả flashcards từ các decks mà teacher hiện tại đã tạo
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of my flashcards
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: My flashcards retrieved successfully
 *                 count:
 *                   type: number
 *                   description: Total number of flashcards
 *                 flashcards:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flashcard'
 *                 total_decks:
 *                   type: number
 *                   description: Total number of decks owned by teacher
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Teacher/Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/flashcard/teacher/{teacherId}:
 *   get:
 *     summary: Get flashcards by teacher ID (Teacher/Admin only)
 *     description: Lấy tất cả flashcards từ các decks của một teacher cụ thể. Teacher chỉ có thể xem flashcards của chính mình, Admin có thể xem tất cả.
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher user ID
 *     responses:
 *       200:
 *         description: List of teacher's flashcards
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 count:
 *                   type: number
 *                 flashcards:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flashcard'
 *                 teacher:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                 total_decks:
 *                   type: number
 *       403:
 *         description: Access denied - You can only view your own flashcards
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/flashcard/teacher/create:
 *   post:
 *     summary: Create a new flashcard (Teacher/Admin only)
 *     description: Create flashcard đơn giản - chỉ cần question và answer. Không có options và correctOption (chỉ dùng trong question bank).
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deck_id
 *               - question
 *               - answer
 *               - tag
 *             properties:
 *               deck_id:
 *                 type: string
 *                 description: Parent deck ID
 *               question:
 *                 type: string
 *                 description: Question text
 *               answer:
 *                 type: string
 *                 description: Answer text
 *               tag:
 *                 type: string
 *                 enum: [geometry, algebra, probability, calculus, statistics, other]
 *                 description: Flashcard category tag
 *               status:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 default: medium
 *                 description: Difficulty level
 *     responses:
 *       201:
 *         description: Flashcard created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 card:
 *                   $ref: '#/components/schemas/Flashcard'
 *       403:
 *         description: Forbidden - Teacher/Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/flashcard/teacher/update/{id}:
 *   put:
 *     summary: Update flashcard (Teacher/Admin only)
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flashcard ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: Question text
 *               answer:
 *                 type: string
 *                 description: Answer text
 *               tag:
 *                 type: string
 *                 enum: [geometry, algebra, probability, calculus, statistics, other]
 *                 description: Flashcard category tag
 *               status:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 description: Difficulty level
 *     responses:
 *       200:
 *         description: Flashcard updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 card:
 *                   $ref: '#/components/schemas/Flashcard'
 *       403:
 *         description: Forbidden - Teacher/Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/flashcard/teacher/delete/{id}:
 *   delete:
 *     summary: Delete flashcard (Teacher/Admin only)
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flashcard ID
 *     responses:
 *       200:
 *         description: Flashcard deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Forbidden - Teacher/Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
