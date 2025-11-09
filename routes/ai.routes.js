import express from 'express';
import { generateQuestions, generateFlashcards, validateQuestion, aiHealthCheck } from '../controllers/ai.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { allowRoles } from '../middleware/role.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/ai/health:
 *   get:
 *     summary: Check AI service health
 *     tags: [AI]
 *     responses:
 *       200:
 *         description: AI service is available
 */
router.get('/health', aiHealthCheck);

/**
 * @swagger
 * /api/ai/generate-questions:
 *   post:
 *     summary: Generate questions using AI
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *               - subject
 *             properties:
 *               topic:
 *                 type: string
 *                 example: "Quadratic Equations"
 *               subject:
 *                 type: string
 *                 example: "Mathematics"
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 example: "medium"
 *               count:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 10
 *                 example: 5
 *               tag:
 *                 type: string
 *                 enum: [geometry, algebra, probability, calculus, statistics, other]
 *                 example: "algebra"
 *     responses:
 *       200:
 *         description: Questions generated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: AI service error
 */
router.post('/generate-questions', verifyToken, allowRoles('Teacher', 'Admin'), generateQuestions);

/**
 * @swagger
 * /api/ai/generate-flashcards:
 *   post:
 *     summary: Generate flashcards using AI
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *               - subject
 *             properties:
 *               topic:
 *                 type: string
 *                 example: "Quadratic Equations"
 *               subject:
 *                 type: string
 *                 example: "Mathematics"
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 example: "medium"
 *               count:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 20
 *                 example: 5
 *               tag:
 *                 type: string
 *                 enum: [geometry, algebra, probability, calculus, statistics, other]
 *                 example: "algebra"
 *     responses:
 *       200:
 *         description: Flashcards generated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: AI service error
 */
router.post('/generate-flashcards', verifyToken, allowRoles('Teacher', 'Admin'), generateFlashcards);

/**
 * @swagger
 * /api/ai/validate-question:
 *   post:
 *     summary: Validate/review a question using AI
 *     tags: [AI]
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
 *               - options
 *               - correctOption
 *             properties:
 *               question:
 *                 type: string
 *                 example: "What is 2 + 2?"
 *               options:
 *                 type: object
 *                 properties:
 *                   A:
 *                     type: string
 *                   B:
 *                     type: string
 *                   C:
 *                     type: string
 *                   D:
 *                     type: string
 *               correctOption:
 *                 type: string
 *                 enum: [A, B, C, D]
 *                 example: "A"
 *               answer:
 *                 type: string
 *               tag:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *               subject:
 *                 type: string
 *               explanation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Question validation completed
 *       400:
 *         description: Invalid input
 *       500:
 *         description: AI service error
 */
router.post('/validate-question', verifyToken, allowRoles('Teacher', 'Admin'), validateQuestion);

export default router;

