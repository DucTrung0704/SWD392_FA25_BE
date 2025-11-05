/**
 * @swagger
 * /api/deck/all:
 *   get:
 *     summary: Get all decks
 *     tags: [Decks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all decks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 decks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Deck'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/deck/all/{id}:
 *   get:
 *     summary: Get deck by ID
 *     tags: [Decks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Deck ID
 *     responses:
 *       200:
 *         description: Deck details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deck'
 *       404:
 *         description: Deck not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/deck/teacher/create:
 *   post:
 *     summary: Create a new deck (Teacher/Admin only)
 *     tags: [Decks]
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
 *             properties:
 *               title:
 *                 type: string
 *                 description: Deck title
 *               description:
 *                 type: string
 *                 description: Deck description
 *               isPublic:
 *                 type: boolean
 *                 default: false
 *                 description: Whether deck is public (true = public, false = private)
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 default: medium
 *                 description: Difficulty level
 *     responses:
 *       201:
 *         description: Deck created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deck:
 *                   $ref: '#/components/schemas/Deck'
 *       403:
 *         description: Forbidden - Teacher/Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/deck/teacher/update/{id}:
 *   put:
 *     summary: Update deck (Teacher/Admin only)
 *     tags: [Decks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Deck ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Deck title
 *               description:
 *                 type: string
 *                 description: Deck description
 *               isPublic:
 *                 type: boolean
 *                 description: Whether deck is public (true = public, false = private)
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 description: Difficulty level
 *     responses:
 *       200:
 *         description: Deck updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deck:
 *                   $ref: '#/components/schemas/Deck'
 *       403:
 *         description: Forbidden - Teacher/Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/deck/teacher/delete/{id}:
 *   delete:
 *     summary: Delete deck (Teacher/Admin only)
 *     tags: [Decks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Deck ID
 *     responses:
 *       200:
 *         description: Deck deleted successfully
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
