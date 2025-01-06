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
 * @swagger
 * /api/hotels:
 *   get:
 *     summary: Retrieve a list of all hotels
 *     tags: [Hotels]
 *     description: Get a list of all available hotels.
 *     responses:
 *       200:
 *         description: A list of all hotels.
 *       500:
 *         description: Internal server error.
 */
router.get("/", getHotels);

/**
 * @swagger
 * /api/hotels/{id}:
 *   get:
 *     summary: Retrieve a specific hotel by its ID
 *     tags: [Hotels]
 *     description: Get a specific hotel using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the hotel.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The hotel corresponding to the provided ID.
 *       404:
 *         description: Hotel not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", getHotel);

/**
 * @swagger
 * /api/hotels:
 *   post:
 *     summary: Create a new hotel
 *     tags: [Hotels]
 *     description: Add a new hotel with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - star_rating
 *               - num_rooms
 *               - images
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the hotel.
 *               property_type:
 *                 type: string
 *                 description: The type of property (e.g., resort, motel, inn).
 *               star_rating:
 *                 type: number
 *                 description: The star rating of the hotel.
 *               num_rooms:
 *                 type: number
 *                 description: The number of rooms in the hotel.
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: A list of image URLs of the hotel.
 *               location:
 *                 type: string
 *                 description: The location of the hotel.
 *               review:
 *                 type: string
 *                 description: A review summary for the hotel.
 *     responses:
 *       201:
 *         description: The newly created hotel.
 *       500:
 *         description: Internal server error.
 */
router.post("/", createHotel);

/**
 * @swagger
 * /api/hotels/{id}:
 *   put:
 *     summary: Update an existing hotel by its ID
 *     tags: [Hotels]
 *     description: Update the details of an existing hotel using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the hotel.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the hotel.
 *               property_type:
 *                 type: string
 *                 description: The type of property (e.g., resort, motel, inn).
 *               star_rating:
 *                 type: number
 *                 description: The star rating of the hotel.
 *               num_rooms:
 *                 type: number
 *                 description: The number of rooms in the hotel.
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: A list of image URLs of the hotel.
 *               location:
 *                 type: string
 *                 description: The location of the hotel.
 *     responses:
 *       200:
 *         description: The updated hotel.
 *       404:
 *         description: Hotel not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", updateHotel);

/**
 * @swagger
 * /api/hotels/{id}:
 *   delete:
 *     summary: Delete a hotel by its ID
 *     tags: [Hotels]
 *     description: Delete a hotel using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the hotel.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A success message indicating the hotel has been deleted.
 *       404:
 *         description: Hotel not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", deleteHotel);

module.exports = router;
