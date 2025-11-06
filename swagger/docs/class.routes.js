/**
 * @swagger
 * /api/class/teacher/create:
 *   post:
 *     summary: Create a new class (Teacher/Admin only)
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Class name
 *               description:
 *                 type: string
 *                 description: Class description
 *     responses:
 *       201:
 *         description: Class created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 class:
 *                   $ref: '#/components/schemas/Class'
 *       400:
 *         description: Bad request - Missing required fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only teachers can create classes
 */

/**
 * @swagger
 * /api/class/teacher/my-classes:
 *   get:
 *     summary: Get all classes created by the teacher
 *     description: Teacher xem tất cả classes của mình
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of teacher's classes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 classes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Class'
 *                 total:
 *                   type: number
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/class/teacher/{id}:
 *   get:
 *     summary: Get class by ID (Teacher/Admin)
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *     responses:
 *       200:
 *         description: Class details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 class:
 *                   $ref: '#/components/schemas/Class'
 *       403:
 *         description: Access denied
 *       404:
 *         description: Class not found
 */

/**
 * @swagger
 * /api/class/teacher/update/{id}:
 *   put:
 *     summary: Update class (Teacher/Admin only)
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Class updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 class:
 *                   $ref: '#/components/schemas/Class'
 *       403:
 *         description: Access denied
 *       404:
 *         description: Class not found
 */

/**
 * @swagger
 * /api/class/teacher/delete/{id}:
 *   delete:
 *     summary: Delete class (Teacher/Admin only)
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *     responses:
 *       200:
 *         description: Class deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Class not found
 */

/**
 * @swagger
 * /api/class/teacher/{id}/add-exam:
 *   post:
 *     summary: Add exam to class (Teacher/Admin only)
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exam_id
 *             properties:
 *               exam_id:
 *                 type: string
 *                 description: Exam ID to add to class
 *     responses:
 *       200:
 *         description: Exam added to class successfully
 *       400:
 *         description: Bad request - Exam already in class or invalid exam_id
 *       403:
 *         description: Access denied
 *       404:
 *         description: Class or exam not found
 */

/**
 * @swagger
 * /api/class/teacher/{id}/remove-exam:
 *   post:
 *     summary: Remove exam from class (Teacher/Admin only)
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exam_id
 *             properties:
 *               exam_id:
 *                 type: string
 *                 description: Exam ID to remove from class
 *     responses:
 *       200:
 *         description: Exam removed from class successfully
 *       400:
 *         description: Bad request - Exam not in class
 *       403:
 *         description: Access denied
 *       404:
 *         description: Class not found
 */

/**
 * @swagger
 * /api/class/teacher/{id}/remove-student:
 *   post:
 *     summary: Remove student from class (Teacher/Admin only)
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_id
 *             properties:
 *               student_id:
 *                 type: string
 *                 description: Student ID to remove from class
 *     responses:
 *       200:
 *         description: Student removed from class successfully
 *       400:
 *         description: Bad request - Student not in class
 *       403:
 *         description: Access denied
 *       404:
 *         description: Class not found
 */

/**
 * @swagger
 * /api/class/teacher/{id}/submissions:
 *   get:
 *     summary: Get all submissions for a class (Teacher/Admin only)
 *     description: Teacher xem tất cả submissions của students trong class. Có thể filter theo exam_id
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *       - in: query
 *         name: exam_id
 *         schema:
 *           type: string
 *         description: Optional - Filter submissions by exam ID
 *     responses:
 *       200:
 *         description: Submissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 class_id:
 *                   type: string
 *                 exam_id:
 *                   type: string
 *                   nullable: true
 *                 exam:
 *                   $ref: '#/components/schemas/Exam'
 *                   nullable: true
 *                 submissions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Submission'
 *                 total:
 *                   type: number
 *                 total_students:
 *                   type: number
 *       403:
 *         description: Access denied
 *       404:
 *         description: Class not found
 */

/**
 * @swagger
 * /api/class/student/my-classes:
 *   get:
 *     summary: Get all classes joined by the student
 *     description: Student xem tất cả classes đã join
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of student's classes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 classes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Class'
 *                 total:
 *                   type: number
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/class/student/all:
 *   get:
 *     summary: Get all classes joined by student
 *     description: Student xem classes đã join
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of classes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 classes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Class'
 *                 total:
 *                   type: number
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/class/student/{id}:
 *   get:
 *     summary: Get class by ID (Student)
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *     responses:
 *       200:
 *         description: Class details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 class:
 *                   $ref: '#/components/schemas/Class'
 *       403:
 *         description: Access denied - Not a member of this class
 *       404:
 *         description: Class not found
 */

/**
 * @swagger
 * /api/class/student/join:
 *   post:
 *     summary: Join class by class code (Student only)
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - class_code
 *             properties:
 *               class_code:
 *                 type: string
 *                 description: Class code to join
 *     responses:
 *       200:
 *         description: Successfully joined class
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 class:
 *                   $ref: '#/components/schemas/Class'
 *       400:
 *         description: Bad request - Invalid class code or already a member
 *       403:
 *         description: Forbidden - Only students can join classes
 *       404:
 *         description: Class not found or inactive
 */

/**
 * @swagger
 * /api/class/student/{id}/leave:
 *   post:
 *     summary: Leave class (Student only)
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *     responses:
 *       200:
 *         description: Successfully left class
 *       403:
 *         description: Access denied
 *       404:
 *         description: Class not found
 */

/**
 * @swagger
 * /api/class/admin/all:
 *   get:
 *     summary: Get all classes (Admin only)
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all classes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 classes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Class'
 *                 total:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /api/class/admin/delete/{id}:
 *   delete:
 *     summary: Delete class (Admin only)
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *     responses:
 *       200:
 *         description: Class deleted successfully
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Class not found
 */

