const express = require('express');
const {
    registerController,
    loginController,
    resetPassword
} = require('../controllers/authControllers');

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user with provided details.
 * @access Public
 * @param {string} username - The user's unique username.
 * @param {string} fname - The user's first name.
 * @param {string} lname - The user's last name.
 * @param {string} address - The user's address.
 * @param {string} phone - The user's phone number.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Object} A success message indicating registration is complete.
 */
router.post('/register', registerController);

/**
 * @route POST /api/auth/login
 * @desc Authenticate a user and return an access token.
 * @access Public
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Object} A success message and an authentication token.
 */
router.post('/login', loginController);

/**
 * @route POST /api/users/resetPassword
 * @desc reset password with email.
 * @access Private
 * @middleware authMiddleware
 * @returns {Object} A message indicating that the password has been successfully reset.
 */
router.post("/resetPassword", resetPassword);

module.exports = router;
