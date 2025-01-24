const express = require('express');
const {
    requestReset,
    resetPassword
} = require('../controllers/resetPasswordController');

const router = express.Router();
/**
 * @swagger
 * /api/auth/requestReset:
 *   post:
 *     summary: Request a password reset link
 *     tags: [Authentication]
 *     description: Allows a user to request a password reset link by providing their email address. The reset token will be sent to the provided email.
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
 *                 description: The email address where the reset link will be sent.
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
router.post('/requestReset', requestReset);

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
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: The user's token for password reset.
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
 *       500:
 *         description: Internal server error.
 */
router.post("/resetPassword", resetPassword);

module.exports = router;
