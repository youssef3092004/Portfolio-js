/**
 * @file validations.js
 * @description This file contains utility functions for validating user inputs such as phone numbers, email addresses, and passwords.
 * It ensures that the input data follows the correct format before further processing.
 * 
 * Functions:
 * - validatePhone: Checks if the phone number has 10 to 15 digits.
 * - validateEmail: Checks if the email is in a valid format.
 * - validatePassword: Checks if the password meets the required strength (e.g., length, characters).
 */

// Validate password
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
  return passwordRegex.test(password);
};

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
}

// Validate phone number (between 10 to 15 digits)
const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

module.exports = { 
  validatePassword,
  validateEmail,
  validatePhone,
};
