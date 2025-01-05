const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const { validatePassword, validateEmail, validatePhone } = require('../utils');

/**
 * @function registerController
 * @description Registers a new user in the system with a hashed password.
 * @route POST /api/users/register
 * @access Public
 * @returns {JSON} A success message if registration is successful, or an error message if something is missing or fails.
 * @throws {Error} If an error occurs during registration, such as a failed database query or other unexpected issue.
 * 
 * This function registers a new user by checking if all required fields are provided,
 * hashing the user's password, checking if the email is already in use, and then
 * creating the new user in the database.
 */
const registerController = async (req, res, next) => {
  try {
    const {
      username, fname, lname, address, phone, email, password
    } = req.body

    const requiredFields = { 
      username, fname, lname, address, phone, email, password
    };
    for (let i in requiredFields) {
      if (!requiredFields[i]) {
        return res.status(400).json({
          success: false,
          error: `${i.charAt(0).toUpperCase() + i.slice(1)} is required`
        });
      }
    }

    if (!validatePassword(password)) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 6 characters long, include a number, and a special character"
      });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format"
      });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({
        success: false,
        error: "Phone number must be between 10 to 15 digits"
      });
    }

    // Hash the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: 'Email already registered, please login!'
      });
    }

    // Create a new user in the database
    await User.create({
      username, fname, lname, address, phone, email, password: hashedPassword
    });

    res.status(201).send({
      success: true,
      message: 'Successfully registered',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function loginController
 * @description Logs in an existing user by validating their email and password.
 * @route POST /api/users/login
 * @access Public
 * @returns {JSON} A success message with a JWT token and user data if login is successful.
 * @throws {Error} If the email or password is incorrect, or if the user doesn't exist.
 *
 * This function checks if the user exists in the database using the provided email and validates the password.
 * If valid, it generates a JSON Web Token (JWT) for the user.
 */
const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const requiredFields = { email, password };
    for (let i in requiredFields) {
      if (!requiredFields[i]) {
        res.status(400).json({
          success: false,
          error: `${i.charAt(0).toUpperCase() + i.slice(1)} is required`
        });
      }
    }

    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).send({
        sucess: false,
        message: 'User not found!',
      });
    }

    // Compare user password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({
        success: false,
        error: "Invalid Password",
      });
    }

    // Generate a JSON Web Token (JWT)
    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  
    // Hide the password for security
    user.password = undefined;

    res.status(200).send({
      success: true,
      message: 'Successfully logged in',
      token,
      user,
    });
  } catch (error) {
    next(error);
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
const  resetPassword = async (req, res) => {
  try {
      const {email, newPassword} = req.body;

      if (!email || !newPassword) {
        return res.status(400).send({
          success: false,
          message: "Please provide all fields"
        });
      }

      if (!validatePassword(newPassword)) {
        return res.status(400).send({
          success: false,
          message: "New password must be at least 6 characters long, include a number, and a special character"
        });
      }

      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found"
        })
      }
      // Hash user password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      await user.save();

      res.status(200).send({
        success: true,
        message: "Password reset successfully!",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in reset password API",
      error
    });
  }
};

module.exports = {
  registerController,
  loginController,
  resetPassword,
};
