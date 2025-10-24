/**
 * @swagger
 * /api/flashcard/student/all:
 *   get:
 *     summary: Get all flashcards (Student access)
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
 */

/**
 * @swagger
 * /api/flashcard/student/{id}:
 *   get:
 *     summary: Get flashcard by ID (Student access)
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
 *         description: Flashcard details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flashcard'
 *       404:
 *         description: Flashcard not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

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
 * /api/flashcard/teacher/create:
 *   post:
 *     summary: Create a new flashcard (Teacher/Admin only)
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - front
 *               - back
 *               - deckId
 *             properties:
 *               front:
 *                 type: string
 *                 description: Front side content
 *               back:
 *                 type: string
 *                 description: Back side content
 *               deckId:
 *                 type: string
 *                 description: Parent deck ID
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 default: easy
 *                 description: Difficulty level
 *               question_image:
 *                 type: string
 *                 format: binary
 *                 description: Question image file
 *               answer_image:
 *                 type: string
 *                 format: binary
 *                 description: Answer image file
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
 *                 flashcard:
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               front:
 *                 type: string
 *                 description: Front side content
 *               back:
 *                 type: string
 *                 description: Back side content
 *               deckId:
 *                 type: string
 *                 description: Parent deck ID
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 description: Difficulty level
 *               question_image:
 *                 type: string
 *                 format: binary
 *                 description: Question image file
 *               answer_image:
 *                 type: string
 *                 format: binary
 *                 description: Answer image file
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
 *                 flashcard:
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
