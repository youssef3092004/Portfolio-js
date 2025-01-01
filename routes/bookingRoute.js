/**
 * @file bookingRoutes.js
 * @desc Defines routes for managing booking resources in the application.
 * @module routes/bookingRoutes
 * @requires express
 * @requires ../controllers/bookingController
 *
 * This file sets up the routes for the CRUD operations related to bookings.
 * It maps HTTP methods (GET, POST, PUT, DELETE) to corresponding controller functions.
 */

const { Router } = require("express");
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const router = Router();

/**
 * @route GET /api/bookings
 * @desc Retrieve a list of all bookings.
 * @access Public
 * @returns {Array} List of all bookings.
 */
router.get("/", getBookings);

/**
 * @route GET /api/bookings/:id
 * @desc Retrieve a specific booking by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the booking.
 * @returns {Object} The booking corresponding to the provided ID.
 */
router.get("/:id", getBooking);

/**
 * @route POST /api/bookings
 * @desc Create a new booking.
 * @access Public
 * @param {Object} bookingDetails - The details of the booking.
 * @param {string} bookingDetails.user - The user who made the booking.
 * @param {string} bookingDetails.room - The room being booked.
 * @param {Date} bookingDetails.check_in - The check-in date.
 * @param {Date} bookingDetails.check_out - The check-out date.
 * @returns {Object} The newly created booking.
 */
router.post("/", createBooking);

/**
 * @route PUT /api/bookings/:id
 * @desc Update an existing booking by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the booking.
 * @param {Object} updatedBooking - The updated booking details.
 * @returns {Object} The updated booking.
 */
router.put("/:id", updateBooking);

/**
 * @route DELETE /api/bookings/:id
 * @desc Delete a booking by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the booking.
 * @returns {Object} A message indicating the booking has been deleted.
 */
router.delete("/:id", deleteBooking);

module.exports = router;
