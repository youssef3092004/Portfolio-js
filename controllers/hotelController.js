const Hotel = require("../models/hotel");

/**
 * @function getHotels
 * @description Fetches all hotels from the database, including populated location and review details.
 * @route GET /api/hotels
 * @access Public
 * @returns {Object} JSON array of hotel objects with populated location and review details.
 * @throws {Error} If no hotels are found or if the database query fails.
 * 
 * This function queries the database for all hotel documents, populates associated location and review data, 
 * and returns them as a JSON array. If no hotels are found, it responds with a 404 status.
 */
const getHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find().populate("location").populate("review");
    if (!hotels) {
      res.status(404);
      throw new Error("There are no hotels available");
    }
    return res.status(200).json(hotels);
  } catch (error) {
    next(error);
  }
};

module.exports = { getHotels };
