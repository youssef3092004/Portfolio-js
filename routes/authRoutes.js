const express = require('express');
const {
    registerController,
    loginController,
    googleLogin,
    googleCallback
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
 *                 description: The user's password (minimum 6 characters long, include a number, and a special character).
 *     responses:
 *       200:
 *         description: A success message indicating registration is complete.
 *       400:
 *         description: Bad request. Missing or invalid data.
 *       409:
 *         description: User already exists.
 *       500:
 *         description: Internal server error.
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
 *       500:
 *         description: Internal server error.
 */
router.post('/login', loginController);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Start Google login
 *     tags: [Authentication]
 *     description: Initiates the Google login process by redirecting the user to Google's OAuth 2.0 login page.
 *     responses:
 *       302:
 *         description: Redirects to Google's OAuth 2.0 login page.
 */
router.get('/google', googleLogin);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google login callback
 *     tags: [Authentication]
 *     description: Handles the callback from Google after user authentication and logs the user in.
 *     responses:
 *       200:
 *         description: Redirects to the home page with a success message after successful login.
 *       302:
 *         description: Redirects to the home page.
 *       400:
 *         description: Redirects with an error message if authentication fails.
 *       500:
 *         description: Internal server error.
 */
router.get('/google/callback', googleCallback);

module.exports = router;
