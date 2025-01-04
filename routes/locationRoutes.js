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
 * @route GET /api/locations
 * @desc Retrieve a list of all locations.
 * @access Public
 * @returns {Array} List of all locations.
 */
router.get("/", getLocations);

/**
 * @route GET /api/locations/:id
 * @desc Retrieve a specific location by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the location.
 * @returns {Object} The location corresponding to the provided ID.
 */
router.get("/:id", getLocation);

/**
 * @route POST /api/locations
 * @desc Create a new location.
 * @access Public
 * @param {Object} locationDetails - The details of the location.
 * @param {string} locationDetails.name - The name of the location.
 * @param {string} locationDetails.description - The description of the location.
 * @param {string} locationDetails.city - The city where the location is situated.
 * @param {string} locationDetails.country - The country where the location is situated.
 * @returns {Object} The newly created location.
 */
router.post("/", createLocation);

/**
 * @route PUT /api/locations/:id
 * @desc Update an existing location by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the location.
 * @param {Object} updatedLocation - The updated location details.
 * @returns {Object} The updated location.
 */
router.put("/:id", updateLocation);

/**
 * @route DELETE /api/locations/:id
 * @desc Delete a location by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the location.
 * @returns {Object} A message indicating the location has been deleted.
 */
router.delete("/:id", deleteLocation);

module.exports = router;
