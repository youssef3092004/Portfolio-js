const Amenity = require("../models/amenity");

/**
 * @route GET /api/amenities
 * @desc Fetch all amenities from the database and return them in the response.
 * @access Public
 * @throws {Error} If no amenities are found, returns a 404 status with a relevant error message.
 * @returns {Object} A JSON array containing all the amenities.
 *
 * This route handler fetches all amenities stored in the database. It uses the Mongoose model `Amenity` to query the database,
 * and the `populate` method is used to retrieve the associated `hotel_amenities`. If no amenities are found, an error is thrown.
 * The result is returned with a status code of 200. If an error occurs during the operation, it is passed to the error handling middleware.
 */
const getAmenities = async (req, res, next) => {
  try {
    const amenities = await Amenity.find().populate("hotel_amenities");
    if (!amenities) {
      res.status(404);
      throw new Error("There are no amenities available");
    }
    return res.status(200).json(amenities);
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/amenities/:id
 * @desc Fetch a specific amenity by its ID from the database.
 * @access Public
 * @param {string} id - The ID of the amenity to fetch.
 * @throws {Error} If the amenity is not found, returns a 404 status with a relevant error message.
 * @returns {Object} The specific amenity matching the provided ID.
 *
 * This route handler fetches a specific amenity from the database based on the `id` parameter passed in the URL.
 * It uses the Mongoose model `Amenity` to query the database, and the `.populate("hotel_amenities")` method to retrieve the associated `hotel_amenities`.
 * If no amenity is found with the provided ID, a 404 error is thrown with the message "There is no amenity by this ID".
 * If the amenity is found, it is returned in JSON format with a status code of 200.
 * If an error occurs during the operation, it is passed to the error handling middleware.
 */
const getAmenity = async (req, res, next) => {
  try {
    const amenity = await Amenity.findById(req.params.id).populate(
      "hotel_amenities"
    );
    if (!amenity) {
      res.status(404);
      throw new Error("There is no amenity by this ID");
    }
    res.status(200).json(amenity);
  } catch (error) {
    next(error);
  }
};

const createAmenity = async (req, res, next) => {
  try {
    const { name, description, hotel_amenities } = req.body;
    const requiredFields = { name, description, hotel_amenities };
    for (let i in requiredFields) {
      if (!requiredFields[i]) {
        res.status(400);
        throw new Error(
          `${i.charAt(0).toUpperCase() + i.slice(1)} is required`
        );
      }
    }
    const newAmenity = new Amenity({
      name,
      description,
      hotel_amenities,
    });
    const savedAmenity = await newAmenity.save();
    res.status(201).json(savedAmenity);
  } catch (error) {
    next(error);
  }
};
