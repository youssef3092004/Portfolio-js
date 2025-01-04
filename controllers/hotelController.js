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

/**
 * @function getHotel
 * @description Fetches a single hotel by its ID from the database, including populated location, rooms, and review details.
 * @route GET /api/hotels/:id
 * @access Public
 * @returns {JSON} JSON object representing a hotel with populated location, rooms, and review details.
 * @throws {Error} If no hotel is found with the provided ID or if the database query fails.
 * 
 * This function queries the database for a single hotel document using the provided ID in the request parameters, 
 * populates associated location, rooms, and review data, and returns it as a JSON object. If no hotel is found, 
 * it responds with a 404 status code.
 */
const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate("location")
      .populate("rooms")
      .populate("review");
    if (!hotel) {
      res.status(404);
      throw new Error("There is no hotel by this ID");
    }
    res.status(200).json(hotel);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHotels,
  getHotel,
};
