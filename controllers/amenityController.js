const Amenity = require("../models/ameniyModel");

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
    const { name, description } = req.body;
    const requiredFields = { name, description };
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
    });
    const savedAmenity = await newAmenity.save();
    res.status(201).json(savedAmenity);
  } catch (error) {
    next(error);
  }
};

/**
 * @route PUT /api/amenities/:id
 * @desc Update an existing amenity in the database.
 * @access Public
 * @param {string} id - The unique ID of the amenity to update.
 * @param {string} name - The updated name of the amenity.
 * @param {string} description - The updated description of the amenity.
 * @throws {Error} If `name` or `description` are missing, returns a 400 status with an error message.
 * @returns {Object} The updated amenity object.
 *
 * This route handler updates an existing amenity by accepting the updated `name`, `description`, and/or `hotel_amenities` from the request body.
 * It checks if both `name` and `description` are provided, returning a 400 error if either is missing.
 * If all required fields are provided, it updates the amenity document in the database using `findByIdAndUpdate`, and returns the updated amenity with a 200 status code.
 * If the amenity to be updated is not found, a 404 error with a failure message is returned.
 * Any errors encountered during the update process are passed to the next middleware.
 */
const updateAmenity = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const updateField = {};
    if (name) updateField.name = name;
    if (description) updateField.description = description;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }
    const updatedAmenity = await Amenity.findByIdAndUpdate(
      req.params.id,
      { $set: updateField },
      { new: true }
    );
    res.status(200).json(updatedAmenity);
  } catch (error) {
    next(error);
  }
};

/**
 * @route DELETE /api/amenities/:id
 * @desc Delete an amenity by its ID from the database.
 * @access Public
 * @param {string} id - The unique ID of the amenity to delete.
 * @throws {Error} If no amenity is found with the provided ID, returns a 404 status with an error message.
 * @returns {Object} A message confirming the deletion of the amenity.
 *
 * This route handler deletes an amenity from the database based on the provided `id` parameter.
 * It first checks if an amenity exists with the given ID. If no amenity is found, it returns a 404 error with a message indicating no amenity was found.
 * If the amenity is found, it is removed from the database, and a success message confirming the deletion is returned with a 200 status code.
 * Any errors encountered during the deletion process are passed to the next middleware.
 */
const deleteAmenity = async (req, res, next) => {
  try {
    const amenity = await Amenity.findById(req.params.id);
    if (!amenity) {
      return res.status(404).json({
        message: "There is no amenity by this ID",
      });
    }
    await amenity.remove();
    res.status(200).json({
      message: "Amenity removed",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAmenities,
  getAmenity,
  createAmenity,
  updateAmenity,
  deleteAmenity,
};
