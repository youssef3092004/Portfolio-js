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
 * @route GET /api/amenities
 * @desc Retrieve a list of all amenities.
 * @access Public
 * @returns {Array} List of all amenities.
 */
router.get("/", getAmenities);

/**
 * @route GET /api/amenities/:id
 * @desc Retrieve a specific amenity by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the amenity.
 * @returns {Object} The amenity corresponding to the provided ID.
 */
router.get("/:id", getAmenity);

/**
 * @route POST /api/amenities
 * @desc Create a new amenity.
 * @access Public
 * @param {Object} amenityDetails - The details of the amenity.
 * @param {string} amenityDetails.name - The name of the amenity.
 * @param {string} amenityDetails.description - The description of the amenity.
 * @param {Array} amenityDetails.hotel_amenities - List of hotel amenities.
 * @returns {Object} The newly created amenity.
 */
router.post("/", createAmenity);

/**
 * @route PUT /api/amenities/:id
 * @desc Update an existing amenity by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the amenity.
 * @param {Object} updatedAmenity - The updated amenity details.
 * @returns {Object} The updated amenity.
 */
router.put("/:id", updateAmenity);

/**
 * @route DELETE /api/amenities/:id
 * @desc Delete an amenity by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the amenity.
 * @returns {Object} A message indicating the amenity has been deleted.
 */
router.delete("/:id", deleteAmenity);

module.exports = router;
