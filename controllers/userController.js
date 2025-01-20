const User = require ('../models/userModel');
const bcrypt = require ('bcrypt');
const {validatePassword, validatePhone, validateEmail} = require ('../utils');
const pagination = require ('../utils/pagination');
const client = require('../config/redisConfig');

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
    const { page, limit, skip } = pagination(req);
    const redisKey = `users:page:${page}:limit:${limit}`;
    const cachedData = await client.get(redisKey);
    if (cachedData) {
      console.log('Using cached data');
      return res.status(200).json(JSON.parse(cachedData));
    }
    const users = await User.find ().skip (skip).limit (limit);
    const total = await User.countDocuments ();
    if (!users || users.length === 0) {
      res.status (404);
      throw new Error ('There are no users available');
    }
    await client.setEx(redisKey, 3600, JSON.stringify(users));
    console.log('Returning data from MongoDB and caching it in Redis');
    return res.status (200).json ({
      page,
      limit,
      total,
      totalPages: Math.ceil (total / limit),
      data: users,
    });
  } catch (error) {
    next (error);
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
    const redisKey = `user:${req.params.id}`;
    const cachedData = await client.get(redisKey);
    if (cachedData) {
      console.log('Using cached data');
      return res.status(200).json(JSON.parse(cachedData));
    }
    const user = await User.findById (req.params.id);
    if (!user) {
      res.status (404);
      throw new Error ('There are no users available');
    }
    await client.setEx(redisKey, 3600, JSON.stringify(user));
    console.log('Returning data from MongoDB and caching it in Redis');
    return res.status (200).json (user);
  } catch (error) {
    next (error);
  }
};

/**
 * @function updateUser
 * @description Updates an existing user in the database based on provided fields.
 * @route PUT /api/users/updateUser/:id
 * @access Private
 * @returns {JSON} JSON object containing the updated user.
 * @throws {Error} If no fields are provided for update or if the user does not exist.
 *
 * This function validates the fields provided in the request body, hashes the new password
 * if provided, and updates the user in the database with the new information. If no fields
 * are provided for update or if the user is not found, it throws an error.
 */
const updateUser = async (req, res, next) => {
  try {
    const {username, fname, lname, address, phone, email} = req.body;

    const updateField = {};
    if (username) {
      updateField.username = username;
    }
    if (fname) {
      updateField.fname = fname;
    }
    if (lname) {
      updateField.lname = lname;
    }
    if (address) {
      updateField.address = address;
    }
    if (phone) {
      if (!validatePhone (phone)) {
        return res.status (400).send ({
          success: false,
          message: 'Invalid phone number. It should be between 10 and 15 digits.',
        });
      }
      updateField.phone = phone;
    }
    if (email) {
      // Validate email
      if (!validateEmail (email)) {
        return res.status (400).send ({
          success: false,
          message: 'Invalid email format.',
        });
      }
      updateField.email = email;
    }

    if (Object.keys (updateField).length === 0) {
      res.status (400);
      throw new Error ('No fields provided for update');
    }
    const user = await User.findByIdAndUpdate (req.params.id, updateField, {
      new: true,
    });
    if (!user) {
      res.status (400);
      throw new Error ('no user with this id' + req.params.id);
    }
    const redisKey = `user:${user._id}`;
    await client.setEx(redisKey, 3600, JSON.stringify(user));
    console.log('Caching updated user in Redis');
    res.status (200).json (user);
  } catch (error) {
    next (error);
  }
};

/**
 * @function deleteUser
 * @description deletes an existing user from the database based on the user ID.
 * @route DELETE /api/users/:id
 * @access Private
 * @param {string} req.params.id - The ID of the user to be deleted.
 * @returns {JSON} JSON object containing a success message upon successful deletion.
 * @throws {Error} If the user does not exist or cannot be deleted.
 *
 * This function deletes a user from the database based on the provided user ID.
 * If the user with the specified ID does not exist, an error is thrown.
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete (req.params.id);
    if (!user) {
      res.status (400);
      throw new Error ('no user with this id' + req.params.id);
    }
    const redisKey = `user:${req.params.id}`;
    await client.del(redisKey);
    console.log('Deleting user from Redis');
    res.status (200).json ({msg: 'the user has been deleted Successfuly'});
  } catch (error) {
    next (error);
  }
};

/**
 * @function updatePassword
 * @description Updates the user's password after verifying the current password.
 * @route PUT /api/users/updatePassword
 * @access Private
 * @middleware authMiddleware
 * @param {string} req.user.id - The ID of the authenticated user extracted from the token.
 * @param {string} req.body.currentPassword - The user's current password.
 * @param {string} req.body.newPassword - The new password to replace the current one.
 * @returns {JSON} JSON object containing a success message upon successful password update.
 * @throws {Error} If the user is not found, the current password is incorrect, or any server error occurs.
 *
 * This function verifies the user's current password, hashes the new password, and updates it in the database.
 * If the current password does not match, an error is returned.
 */
const updatePassword = async (req, res) => {
  try {
    console.log ('User ID from token:', req.user.id);

    // Fetch user by ID from the token
    const user = await User.findById ({_id: req.user.id});
    if (!user) {
      return res.status (404).send ({
        success: false,
        message: 'User not found',
      });
    }
    const {currentPassword, newPassword} = req.body;
    if (!currentPassword || !newPassword) {
      return res.status (400).send ({
        success: false,
        message: 'Please provide current password and new password',
      });
    }

    if (!validatePassword (newPassword)) {
      return res.status (400).send ({
        success: false,
        message: 'New password must be at least 6 characters long, include a number, and a special character',
      });
    }

    const isMatch = await bcrypt.compare (currentPassword, user.password);
    if (!isMatch) {
      return res.status (401).send ({
        success: false,
        error: 'Current password is incorrect!',
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt (10);
    const hashedPassword = await bcrypt.hash (newPassword, salt);

    user.password = hashedPassword;
    await user.save ();

    res.status (200).send ({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.log (error);
    res.status (500).send ({
      success: false,
      message: 'An error occurred while updating the password',
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updatePassword,
};
