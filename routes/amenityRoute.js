/**
 * @file amenityRoutes.js
 * @desc Defines routes for managing amenities in the application.
 * @module routes/amenityRoutes
 * @requires express
 * @requires ../controllers/amenityController
 *
 * This file sets up the routes for the CRUD operations related to amenities.
 * It maps HTTP methods (GET, POST, PUT, DELETE) to corresponding controller functions.
 */

const { Router } = require("express");
const {
  getAmenities,
  getAmenity,
  createAmenity,
  updateAmenity,
  deleteAmenity,
} = require("../controllers/amenityController");

const router = Router();

/**
 * @swagger
 * /api/amenities:
 *   get:
 *     summary: Retrieve a list of all amenities
 *     tags: [Amenities]
 *     description: Get a list of all amenities available.
 *     responses:
 *       200:
 *         description: A list of all amenities.
 *       500:
 *         description: Internal server error.
 */
router.get("/", getAmenities);

/**
 * @swagger
 * /api/amenities/{id}:
 *   get:
 *     summary: Retrieve a specific amenity by its ID
 *     tags: [Amenities]
 *     description: Get a specific amenity using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the amenity.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The amenity corresponding to the provided ID.
 *       404:
 *         description: Amenity not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", getAmenity);

/**
 * @swagger
 * /api/amenities:
 *   post:
 *     summary: Create a new amenity
 *     tags: [Amenities]
 *     description: Add a new amenity with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - hotel_amenities
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the amenity.
 *               description:
 *                 type: string
 *                 description: The description of the amenity.
 *               hotel_amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of hotel amenities associated with this amenity.
 *     responses:
 *       201:
 *         description: new amenity created.
 *       500:
 *         description: Internal server error.

 */
router.post("/", createAmenity);

/**
 * @swagger
 * /api/amenities/{id}:
 *   put:
 *     summary: Update an existing amenity by its ID
 *     tags: [Amenities]
 *     description: Update the details of an existing amenity using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the amenity.
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
 *                 description: The name of the amenity.
 *               description:
 *                 type: string
 *                 description: The description of the amenity.
 *               hotel_amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of hotel amenities associated with this amenity.
 *     responses:
 *       200:
 *         description: The updated amenity.
 *       404:
 *         description: Amenity not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", updateAmenity);

/**
 * @swagger
 * /api/amenities/{id}:
 *   delete:
 *     summary: Delete an amenity by its ID
 *     tags: [Amenities]
 *     description: Delete an amenity using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the amenity.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A success message indicating the amenity has been deleted.
 *       404:
 *         description: Amenity not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", deleteAmenity);

module.exports = router;
