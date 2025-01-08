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
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Retrieve a list of all rooms
 *     tags: [Rooms]
 *     description: Retrieve a list of all rooms available in the system.
 *     responses:
 *       200:
 *         description: A list of all rooms.
 *       500:
 *         description: Internal server error.
 */
router.get('/', getRooms);

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Retrieve a specific room by its ID
 *     tags: [Rooms]
 *     description: Retrieve the details of a specific room using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier for the room.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The room corresponding to the provided ID.
 *       404:
 *         description: Room not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.get('/:id', getRoom);

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     description: Add a new room to the system with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - room_type
 *               - room_number
 *               - price
 *               - status
 *               - hotel
 *               - amenities
 *             properties:
 *               room_type:
 *                 type: string
 *                 description: The type of the room (e.g., single, double, suite).
 *               room_number:
 *                 type: number
 *                 description: The number of the room.
 *               price:
 *                 type: number
 *                 description: The price per night for the room.
 *               status:
 *                 type: string
 *                 description: The status of the room (e.g., available, booked).
 *               hotel:
 *                 type: string
 *                 description: The ID of the hotel the room belongs to.
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of amenities available in the room.
 *     responses:
 *       201:
 *         description: The newly created room.
 *       500:
 *         description: Internal server error.
 */
router.post('/', createRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   put:
 *     summary: Update an existing room by its ID
 *     tags: [Rooms]
 *     description: Update the details of an existing room using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier for the room.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               room_type:
 *                 type: string
 *                 description: The type of the room (e.g., single, double, suite).
 *               room_number:
 *                 type: number
 *                 description: The number of the room.
 *               price:
 *                 type: number
 *                 description: The price per night for the room.
 *               status:
 *                 type: string
 *                 description: The status of the room (e.g., available, booked).
 *               hotel:
 *                 type: string
 *                 description: The ID of the hotel the room belongs to.
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of amenities available in the room.
 *     responses:
 *       200:
 *         description: The updated room.
 *       404:
 *         description: Room not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.put('/:id', updateRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     summary: Delete a room by its ID
 *     tags: [Rooms]
 *     description: Delete a specific room using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier for the room.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A message indicating the room has been deleted.
 *       404:
 *         description: Room not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.delete('/:id', deleteRoom);

module.exports = router;
