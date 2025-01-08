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
    if (!locations || locations.length === 0) {
      res.status(404);
      throw new Error("There are no locations available");
    }
    return res.status(200).json(locations);
  } catch (error) {
    next(error);
  }
};


module.exports = { getLocations };
