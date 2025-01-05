/**
 * @file userRoutes.js
 * @desc Defines routes for managing users in the application.
 * @module routes/userRoutes
 * @requires express
 * @requires ../controllers/userController
 *
 * This file sets up the routes for the CRUD operations related to users.
 * It maps HTTP methods (GET, POST, PUT, DELETE) to corresponding controller functions.
 */

const { Router } = require("express");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = Router();

/**
 * @route GET /api/users
 * @desc Retrieve a list of all users.
 * @access Public
 * @returns {Array} List of all users.
 */
router.get("/", authMiddleware, getUsers);
/**
 * @route GET /api/users/:id
 * @desc Retrieve a specific user by their ID.
 * @access Public
 * @param {string} id - The unique identifier for the user.
 * @returns {Object} The user corresponding to the provided ID.
 */
router.get("/:id", authMiddleware, getUser);

/**
 * @route PUT /api/users/:id
 * @desc Update an existing user by their ID.
 * @access Public
 * @param {string} id - The unique identifier for the user.
 * @param {Object} updatedUser - The updated user details.
 * @returns {Object} The updated user.
 */
router.put("/:id", authMiddleware, updateUser);

/**
 * @route DELETE /api/users/:id
 * @desc Delete a user by their ID.
 * @access Public
 * @param {string} id - The unique identifier for the user.
 * @returns {Object} A message indicating the user has been deleted.
 */
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;
