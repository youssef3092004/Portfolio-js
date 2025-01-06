const express = require('express');
const {
    registerController,
    loginController,
    resetPassword
} = require('../controllers/authControllers');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     description: Register a new user with provided details.
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
 *                 description: The user's unique username.
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
 *               password:
 *                 type: string
 *                 description: The user's password (minimum 8 characters, one uppercase letter, one number, one special character).
 *     responses:
 *       200:
 *         description: A success message indicating registration is complete.
 *       400:
 *         description: Bad request. Missing or invalid data.
 *       409:
 *         description: User already exists.
 */
router.post('/register', registerController);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate a user and return an access token
 *     tags: [Authentication]
 *     description: Authenticate a user by their email and password, and return an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: A success message with the authentication token.
 *       400:
 *         description: Bad request. Missing or invalid data.
 *       401:
 *         description: Unauthorized. Invalid email or password.
 */
router.post('/login', loginController);

/**
 * @swagger
 * /api/auth/resetPassword:
 *   post:
 *     summary: Reset password with email
 *     tags: [Authentication]
 *     description: Allows a user to reset their password by providing their email address.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address for password reset.
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user.
 *     responses:
 *       200:
 *         description: A success message indicating the password has been successfully reset.
 *       400:
 *         description: Bad request. Missing or invalid email.
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *       404:
 *         description: User not found with the provided email.
 */
router.post("/resetPassword", resetPassword);


module.exports = router;
