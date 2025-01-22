const User = require('../models/userModel');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validatePassword } = require('../utils/validations');

/**
 * @function resetPassword
 * @description Resets the user's password based on the provided email and new password.
 * @route POST /api/users/resetPassword
 * @access Public
 * @param {string} req.body.email - The email of the user whose password is being reset.
 * @param {string} req.body.newPassword - The new password to set for the user.
 * @returns {JSON} JSON object containing a success message upon successful password reset.
 * @throws {Error} If the user does not exist or there is an error while resetting the password.
 *
 * This function allows a user to reset their password by providing their email and a new password.
 * If the email exists in the database, the password will be updated with the new hashed password.
 */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body; // Get the token and newPassword from the body

    if (!token || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields"
      });
    }

    // Validate password (ensure it meets password criteria)
    if (!validatePassword(newPassword)) {
      return res.status(400).send({
        success: false,
        message: "New password must be at least 6 characters long, include a number, and a special character"
      });
    }

    // Verify token
	  let decoded;
    try {
      decoded = JWT.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: "Invalid or expired token",
        error
      });
    }

    // Find the user by decoded user ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password in the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Password reset successfully!",
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ success: false, message: 'Reset token expired.' });
    }
    res.status(500).send({
      success: false,
      message: "Error in reset password API",
    });
  }
};

module.exports = {
	resetPassword,
};
