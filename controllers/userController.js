const User = require("../models/user");

/**
 * @function getUsers
 * @description Retrieves all users from the database.
 * @route GET /api/users
 * @access Private
 * @returns {JSON} JSON array containing all users in the database.
 * @throws {Error} If no users are found in the database.
 *
 * This function fetches all users from the database. If no users are found, 
 * it returns a 404 error with a message. If successful, it returns a 
 * JSON array containing all users.
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) {
      res.status(404);
      throw new Error("There are no users available");
    }
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * @function getUser
 * @description Fetches a specific user by their ID.
 * @route GET /api/users/:id
 * @access Public
 * @param {string} id - The ID of the user to fetch.
 * @returns {JSON} JSON object containing the user's data.
 * @throws {Error} If no user is found by the provided ID.
 *
 * This function retrieves a user from the database by their ID.
 * If the user is found, the user's data is returned in the response.
 * If no user is found, an error message is thrown.
 */
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(res.params.id);
    if (!user) {
      res.status(404);
      throw new Error("There are no users available");
    }
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUser,
};
