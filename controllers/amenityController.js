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

/**
 * @route PUT /api/amenities/:id
 * @desc Update an existing amenity by its ID in the database.
 * @access Public
 * @param {string} id - The ID of the amenity to update.
 * @body {Object} - The fields to update in the amenity:
 *  - {string} name - The new name of the amenity (optional).
 *  - {string} description - The new description of the amenity (optional).
 *  - {Array} hotel_amenities - The updated list of hotel amenities (optional).
 * @throws {Error} If required fields are missing, returns a 400 status with an error message.
 * @throws {Error} If the amenity with the provided ID is not found, returns a 404 status with an error message.
 * @returns {Object} The updated amenity object.
 * 
 * This route handler updates an existing amenity by its ID. It first checks if any required fields are missing in the request body.
 * Then, it uses `Amenity.findByIdAndUpdate()` to update the amenity in the database. If the amenity is not found or the update fails, a 404 error is thrown.
 * If the amenity is successfully updated, it is returned in a JSON format with a 200 status code.
 * If an error occurs during the operation, it is passed to the error handling middleware.
 */
const updateAmenity = async (req, res, next) => {
  try {
    const { name, description, hotel_amenities } = req.body;
    const updateField = {};
    if (name) updateField.name = name;
    if (description) updateField.description = description;
    if (hotel_amenities) updateField.hotel_amenities = hotel_amenities;
    for (let i in updateField) {
      if (!updateField[i] || updateField[i] === "") {
        res.status(400);
        throw new Error(
          `${i.charAt(0).toUpperCase() + i.slice(1)} is required`
        );
      }
    }
    const updatedAmenity = await Amenity.findByIdAndUpdate(
      req.params.id,
      { $set: updateField },
      { new: true }
    );
    if (!updatedAmenity) {
      res.status(404);
      throw new Error("Failed to update the amenity");
    }
    res.status(200).json(updatedAmenity);
  } catch (error) {
    next(error);
  }
};

/**
 * @route DELETE /api/amenities/:id
 * @desc Delete an amenity by its ID from the database.
 * @access Public
 * @param {string} id - The ID of the amenity to delete.
 * @throws {Error} If the amenity with the provided ID is not found, returns a 404 status with an error message.
 * @returns {Object} A message indicating the amenity has been removed.
 * 
 * This route handler deletes an amenity by its ID. It first checks if an amenity with the provided ID exists. If not, it returns a 404 error.
 * If the amenity exists, it uses `amenity.remove()` to delete the amenity from the database.
 * If the amenity is successfully deleted, a 200 status is returned with a success message.
 * If an error occurs during the operation, it is passed to the error handling middleware.
 */
const deleteAmenity = async (req, res, next) => {
    try {
        const amenity = await Amenity.findById(req.params.id);
        if (!amenity) {
            res.status(404);
            throw new Error("There is no amenity by this ID");
        }
        await amenity.remove();
        res.status(200).json({ message: "Amenity removed" });
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
