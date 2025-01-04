/**
 * @file roomRoutes.js
 * @desc Defines routes for managing rooms in the application.
 * @module routes/roomRoutes
 * @requires express
 * @requires ../controllers/roomController
 *
 * This file sets up the routes for the CRUD operations related to rooms.
 * It maps HTTP methods (GET, POST, PUT, DELETE) to corresponding controller functions.
 */

const { Router } = require("express");
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");

const router = Router();

/**
 * @route GET /api/rooms
 * @desc Retrieve a list of all rooms.
 * @access Public
 * @returns {Array} List of all rooms.
 */
router.get('/', getRooms);

/**
 * @route GET /api/rooms/:id
 * @desc Retrieve a specific room by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the room.
 * @returns {Object} The room corresponding to the provided ID.
 */
router.get('/:id', getRoom);

/**
 * @route POST /api/rooms
 * @desc Create a new room.
 * @access Public
 * @param {Object} roomDetails - The details of the room.
 * @param {string} roomDetails.name - The name of the room.
 * @param {string} roomDetails.type - The type of the room (e.g., single, double, suite).
 * @param {number} roomDetails.capacity - The capacity of the room (number of people).
 * @param {number} roomDetails.price - The price of the room per night.
 * @returns {Object} The newly created room.
 */
router.post('/', createRoom);

/**
 * @route PUT /api/rooms/:id
 * @desc Update an existing room by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the room.
 * @param {Object} updatedRoom - The updated room details.
 * @returns {Object} The updated room.
 */
router.put('/:id', updateRoom);

/**
 * @route DELETE /api/rooms/:id
 * @desc Delete a room by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the room.
 * @returns {Object} A message indicating the room has been deleted.
 */
router.delete('/:id', deleteRoom);

module.exports = router;
