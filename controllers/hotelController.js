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

/**
 * @function createHotel
 * @description Creates a new hotel and saves it to the database.
 * @route POST /api/hotels
 * @access Public
 * @returns {JSON} JSON object representing the newly created hotel.
 * @throws {Error} If any required field (name, star rating, number of rooms, images, location) is missing or if the database query fails.
 * 
 * This function accepts hotel details from the request body, validates the required fields, 
 * creates a new hotel object, and saves it to the database. If any required fields are missing, 
 * it responds with a 404 status code and an error message. Upon successful creation, it returns the 
 * newly created hotel as a JSON object.
 */
const createHotel = async (req, res, next) => {
  try {
    const {
      name,
      property_type,
      star_rating,
      num_rooms,
      images,
      location,
      review,
    } = req.body;
    const newHotel = new Hotel({
      name,
      property_type,
      star_rating,
      num_rooms,
      images,
      location,
      review,
    });
    if (!name) {
      res.status(404);
      throw new Error("Name is required");
    }
    if (!star_rating) {
      res.status(404);
      throw new Error("Star Rating is required");
    }
    if (!num_rooms) {
      res.status(404);
      throw new Error("Number of Rooms is required");
    }
    if (!images) {
      res.status(404);
      throw new Error("Images are required");
    }
    if (!location) {
      res.status(404);
      throw new Error("Location is required");
    }
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHotels,
  getHotel,
  createHotel,
};
