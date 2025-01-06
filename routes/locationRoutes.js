/**
 * @file locationRoutes.js
 * @desc Defines routes for managing locations in the application.
 * @module routes/locationRoutes
 * @requires express
 * @requires ../controllers/locationController
 *
 * This file sets up the routes for the CRUD operations related to locations.
 * It maps HTTP methods (GET, POST, PUT, DELETE) to corresponding controller functions.
 */

const { Router } = require("express");
const {
  getLocation,
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} = require("../controllers/locationController");

const router = Router();

/**
 * @swagger
 * /api/locations:
 *   get:
 *     summary: Retrieve a list of all locations
 *     tags: [Locations]
 *     description: Get a list of all available locations.
 *     responses:
 *       200:
 *         description: A list of all locations.
 *       500:
 *         description: Internal server error.
 */
router.get("/", getLocations);

/**
 * @swagger
 * /api/locations/{id}:
 *   get:
 *     summary: Retrieve a specific location by its ID
 *     tags: [Locations]
 *     description: Get a specific location using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the location.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The location corresponding to the provided ID.
 *       404:
 *         description: Location not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", getLocation);

/**
 * @swagger
 * /api/locations:
 *   post:
 *     summary: Create a new location
 *     tags: [Locations]
 *     description: Add a new location with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - country
 *               - city
 *               - address
 *               - zip_code
 *             properties:
 *               country:
 *                 type: string
 *                 description: The country of the location.
 *               city:
 *                 type: string
 *                 description: The city of the location.
 *               address:
 *                 type: string
 *                 description: The address of the location.
 *               zip_code:
 *                 type: string
 *                 description: The postal or zip code of the location.
 *     responses:
 *       201:
 *         description: The newly created location.
 *       500:
 *         description: Internal server error.
 */
router.post("/", createLocation);

/**
 * @swagger
 * /api/locations/{id}:
 *   put:
 *     summary: Update an existing location by its ID
 *     tags: [Locations]
 *     description: Update the details of an existing location using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the location.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *                 description: The country of the location.
 *               city:
 *                 type: string
 *                 description: The city of the location.
 *               address:
 *                 type: string
 *                 description: The address of the location.
 *               zip_code:
 *                 type: string
 *                 description: The postal or zip code of the location.
 *     responses:
 *       200:
 *         description: The updated location.
 *       404:
 *         description: Location not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", updateLocation);

/**
 * @swagger
 * /api/locations/{id}:
 *   delete:
 *     summary: Delete a location by its ID
 *     tags: [Locations]
 *     description: Delete a location using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the location.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A success message indicating the location has been deleted.
 *       404:
 *         description: Location not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", deleteLocation);

module.exports = router;
