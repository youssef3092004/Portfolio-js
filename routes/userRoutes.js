/**
 * @file userRoutes.js
 * @desc Defines routes for managing users in the application.
 * @module routes/userRoutes
 * @requires express
 * @requires ../controllers/userController
 *
 * This file sets up the routes for the CRUD operations related to users.
 * It maps HTTP methods (GET, POST, PUT, DELETE) to corresponding controller functions.
 */

const { Router } = require("express");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updatePassword,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     description: Retrieve a list of all users (requires Authorization)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users.
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *       404:
 *         description: User not found.
 * 
 * @route GET /api/users
 * @desc Retrieve a list of all users.
 * @access Public
 * @returns {Array} List of all users.
 */
router.get("/", authMiddleware, getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a specific user
 *     tags: [Users]
 *     description: Retrieve a specific user by their ID (requires Authorization)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A specific user.
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *       404:
 *         description: User not found.
 * 
 * @route GET /api/users/:id
 * @desc Retrieve a specific user by their ID.
 * @access Public
 * @param {string} id - The unique identifier for the user.
 * @returns {Object} The user corresponding to the provided ID.
 */
router.get("/:id", authMiddleware, getUser);

/**
 * @swagger
 * /api/users/updateUser/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags: [Users]
 *     description: Update an existing user by their ID (requires Authorization)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the user.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - fname
 *               - lname
 *               - address
 *               - phone
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The new username for the user.
 *               fname:
 *                 type: string
 *                 description: The user's first name.
 *               lname:
 *                 type: string
 *                 description: The user's last name.
 *               address:
 *                 type: string
 *                 description: The user's address.
 *               phone:
 *                 type: string
 *                 description: The user's phone number (10-15 digits).
 *                 example: 0123456789
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *     responses:
 *       200:
 *         description: An updated user.
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *       404:
 *         description: User not found.
 *
 * @route PUT /api/users/updateUser/:id
 * @desc Update an existing user by their ID.
 * @access Public
 * @param {string} id - The unique identifier for the user.
 * @param {Object} updatedUser - The updated user details.
 * @returns {Object} The updated user.
 */
router.put("/updateUser/:id", authMiddleware, updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     description: Delete a user by their ID (requires Authorization)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A message indicating the user has been deleted.
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *       404:
 *         description: User not found.
 * 
 * @route DELETE /api/users/:id
 * @desc Delete a user by their ID.
 * @access Private
 * @param {string} id - The unique identifier for the user.
 * @returns {Object} A message indicating the user has been deleted.
 */
router.delete("/:id", authMiddleware, deleteUser);

/**
 * @swagger
 * /api/users/updatePassword:
 *   put:
 *     summary: Update user password
 *     tags: [Users]
 *     description: Update the user's password (requires Authorization)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: The user's current password.
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user.
 *     responses:
 *       200:
 *         description: A message indicating the password has been successfully updated.
 *       400:
 *         description: Invalid input or missing required fields.
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 * 
 * @route PUT /api/users/updatePassword
 * @desc Update the user's password after verification.
 * @access Private
 * @middleware authMiddleware
 * @param {string} currentPassword - The user's current password.
 * @param {string} newPassword - The new password for the user.
 * @returns {Object} A message indicating the password has been successfully updated.
 */
router.put("/updatePassword", authMiddleware, updatePassword);

module.exports = router;
