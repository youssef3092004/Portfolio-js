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
 * @desc Retrieve a specific amenity by its ID from the database.
 * @access Public
 * @param {string} id - The unique ID of the amenity to retrieve.
 * @throws {Error} If no amenity is found with the provided ID, returns a 404 status with an error message.
 * @returns {Object} The amenity object corresponding to the provided ID.
 * 
 * This route handler retrieves an amenity from the database using the provided `id` parameter from the request. 
 * It first checks if an amenity exists with the given ID. If no amenity is found, it returns a 404 error with a message indicating no amenities are available. 
 * If the amenity is found, the amenity object is returned with a 200 status code.
 * In case of any errors during the database query, it passes the error to the next middleware.
 */
const getAmenity = async (req, res, next) => {
  try {
    const amenity = await Amenity.findById(req.params.id);
    if (!amenity) {
      return res
        .status(404)
        .json({ message: "There are no amenities available" });
    }
    res.status(200).json(amenity);
  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/amenities
 * @desc Create a new amenity in the database.
 * @access Public
 * @param {string} name - The name of the amenity.
 * @param {string} description - A description of the amenity.
 * @param {Array} hotel_amenities - Array of hotel amenity IDs that this amenity is associated with.
 * @throws {Error} If any of the required fields (name, description, hotel_amenities) are missing, returns a 400 status with an error message.
 * @returns {Object} The newly created amenity.
 * 
 * This route handler creates a new amenity by accepting the necessary details in the request body: `name`, `description`, and `hotel_amenities`. 
 * It first checks if all required fields are provided. If any field is missing, a 400 error is thrown. If all required fields are present, 
 * it creates a new amenity document and saves it to the database. The newly created amenity is then returned with a 201 status code.
 * If an error occurs during the operation, it is passed to the error handling middleware.
 */
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
