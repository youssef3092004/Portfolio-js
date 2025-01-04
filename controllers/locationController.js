const Location = require("../models/location");

/**
 * @function getLocations
 * @description Fetches all locations from the database.
 * @route GET /api/locations
 * @access Public
 * @returns {JSON} JSON array of location objects.
 * @throws {Error} If no locations are found in the database or if the database query fails.
 * 
 * This function queries the database for all location documents and returns them as a JSON array. 
 * If no locations are found, it responds with a 404 status code and an error message.
 */
const getLocations = async (req, res, next) => {
  try {
    const locations = await Location.find();
    if (!locations) {
      res.status(404);
      throw new Error("There are no locations available");
    }
    return res.status(200).json(locations);
  } catch (error) {
    next(error);
  }
};

/**
 * @function getLocation
 * @description Fetches a single location from the database by its ID.
 * @route GET /api/locations/:id
 * @access Public
 * @param {string} id - The ID of the location to fetch from the database.
 * @returns {JSON} A JSON object representing the location.
 * @throws {Error} If no location is found for the provided ID or if the database query fails.
 * 
 * This function queries the database for a location by its unique ID provided in the request parameters. 
 * If the location is found, it returns the location data as a JSON object. 
 * If no location is found, it responds with a 404 status code and an error message.
 */
const getLocation = async (req, res, next) => {
    try {
      const location = await Location.findById(req.params.id);
      if (!location) {
        res.status(404);
        throw new Error("There is no location by this ID");
      }
      return res.status(200).json(location);
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = {
    getLocations,
    getLocation,
  };
