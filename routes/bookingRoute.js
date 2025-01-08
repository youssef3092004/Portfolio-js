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
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Retrieve a list of all bookings
 *     tags: [Bookings]
 *     description: Get a list of all bookings available.
 *     responses:
 *       200:
 *         description: A list of all bookings.
 *       500:
 *         description: Internal server error.
 */
router.get("/", getBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Retrieve a specific booking by its ID
 *     tags: [Bookings]
 *     description: Get a specific booking using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the booking.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The booking corresponding to the provided ID.
 *       404:
 *         description: Booking not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", getBooking);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     description: Add a new booking with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - room
 *               - check_in
 *               - check_out
 *               - status
 *               - hotel
 *             properties:
 *               user:
 *                 type: string
 *                 description: The user who made the booking.
 *               room:
 *                 type: string
 *                 description: The room being booked.
 *               check_in:
 *                 type: string
 *                 format: date-time
 *                 description: The check-in date.
 *               check_out:
 *                 type: string
 *                 format: date-time
 *                 description: The check-out date.
 *               status:
 *                 type: string
 *                 description: The status of the booking (e.g., confirmed, pending).
 *               hotel:
 *                 type: string
 *                 description: The hotel associated with the booking.
 *               discount:
 *                 type: string
 *                 description: Optional discount code applied to the booking.
 *     responses:
 *       201:
 *         description: The newly created booking.
 *       500:
 *         description: Internal server error.
 */
router.post("/", createBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Update an existing booking by its ID
 *     tags: [Bookings]
 *     description: Update the details of an existing booking using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the booking.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: The user who made the booking.
 *               room:
 *                 type: string
 *                 description: The room being booked.
 *               check_in:
 *                 type: string
 *                 format: date-time
 *                 description: The check-in date.
 *               check_out:
 *                 type: string
 *                 format: date-time
 *                 description: The check-out date.
 *               status:
 *                 type: string
 *                 description: The status of the booking (e.g., confirmed, pending).
 *               hotel:
 *                 type: string
 *                 description: The hotel associated with the booking.
 *               discount:
 *                 type: string
 *                 description: Optional discount code applied to the booking.
 *     responses:
 *       200:
 *         description: The updated booking.
 *       404:
 *         description: Booking not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", updateBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Delete a booking by its ID
 *     tags: [Bookings]
 *     description: Delete a booking using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the booking.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A success message indicating the booking has been deleted.
 *       404:
 *         description: Booking not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", deleteBooking);

module.exports = router;
