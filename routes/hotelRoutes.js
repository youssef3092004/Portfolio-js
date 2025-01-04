/**
 * @file hotelRoutes.js
 * @desc Defines routes for managing hotels in the application.
 * @module routes/hotelRoutes
 * @requires express
 * @requires ../controllers/hotelController
 *
 * This file sets up the routes for the CRUD operations related to hotels.
 * It maps HTTP methods (GET, POST, PUT, DELETE) to corresponding controller functions.
 */

const { Router } = require("express");
const {
  getHotel,
  getHotels,
  createHotel,
  updateHotel,
  deleteHotel,
} = require("../controllers/hotelController");

const router = Router();

/**
 * @route GET /api/hotels
 * @desc Retrieve a list of all hotels.
 * @access Public
 * @returns {Array} List of all hotels.
 */
router.get("/", getHotels);

/**
 * @route GET /api/hotels/:id
 * @desc Retrieve a specific hotel by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the hotel.
 * @returns {Object} The hotel corresponding to the provided ID.
 */
router.get("/:id", getHotel);

/**
 * @route POST /api/hotels
 * @desc Create a new hotel.
 * @access Public
 * @param {Object} hotelDetails - The details of the hotel.
 * @param {string} hotelDetails.name - The name of the hotel.
 * @param {string} hotelDetails.location - The location of the hotel.
 * @param {string} hotelDetails.description - The description of the hotel.
 * @returns {Object} The newly created hotel.
 */
router.post("/", createHotel);

/**
 * @route PUT /api/hotels/:id
 * @desc Update an existing hotel by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the hotel.
 * @param {Object} updatedHotel - The updated hotel details.
 * @returns {Object} The updated hotel.
 */
router.put("/:id", updateHotel);

/**
 * @route DELETE /api/hotels/:id
 * @desc Delete a hotel by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the hotel.
 * @returns {Object} A message indicating the hotel has been deleted.
 */
router.delete("/:id", deleteHotel);

module.exports = router;
