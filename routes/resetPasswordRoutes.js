const express = require('express');
const {
    resetPassword
} = require('../controllers/resetPasswordController');

const router = express.Router();

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
