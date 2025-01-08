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
    const amenities = await Amenity.find();
    if (!amenities || amenities.length === 0) {
      return res.status(404).json({
        message: "There are no amenities available",
      });
    }
    return res.status(200).json(amenities);
  } catch (error) {
    next(error);
  }
};
