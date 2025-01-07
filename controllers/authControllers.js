const User = require('../models/userModel');
const bcrypt = require('bcrypt');
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
      return res.status(409).send({
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

module.exports = {
  registerController,
};
