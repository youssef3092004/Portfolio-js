const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validatePassword } = require('../utils/validations');

/**
 * @function requestReset
 * @description Handles a password reset request by generating a JWT token and sending it to the user's email.
 * @route POST /api/auth/requestReset
 * @access Public
 * @param {Object} req - Express request object.
 * @param {string} req.body.email - The email of the user requesting the password reset.
 * @returns {JSON} - JSON response with a success message or an error message.
 * @throws {Error} - If the email is not provided, the user does not exist, or an error occurs during email sending or token generation.
 *
 * This function allows a user to request a password reset by providing their email address. 
 * If the email exists in the database, a JWT token is generated and sent to the user via email.
 * The token is valid for 15 minutes.
 *
 */
const requestReset = async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required.'
        });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }
  
      // Generate token
      const resetToken = JWT.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  
      // Send email
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const email_content = `
      <html>
      <body style="font-family: Arial, Helvetica, sans-serif">
        <h2>Password Reset Request</h2>
        <p>Dear ${user.fname},</p>
        <p>We received a request to reset your password for your <strong>Bookify</strong> account. If you made this request, please use the following token to reset your password:</p>
        
        <p><strong>${resetToken}</strong></p>
  
        <p>This token will expire in 15 minutes. If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
        
        <p>If you have any questions or concerns, feel free to contact our support team.</p>
        
        <p>Thank you for choosing Bookify.<br>The Bookify Team</p>
      </body>
      </html>
      `;
      
      await transporter.sendMail({
        from: `"Bookify Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Request',
        html: email_content,
      });
      
      res.status(200).json({
        success: true,
        message: 'email message with token to reset password.'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
				message: 'Internal server error',
      });
    }
  };
  
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
	requestReset
};
