const Hotel = require ('../models/hotelModel');
const pagination = require ('../utils/pagination');

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
    const {page, limit, skip} = pagination (req);
    const hotels = await Hotel.find ()
      .populate ('location')
      .skip (skip)
      .limit (limit);
    const total = await Hotel.countDocuments ();
    if (!hotels) {
      res.status (404);
      throw new Error ('There are no hotels available');
    }
    return res.status (200).json ({
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
      data: hotels,
    });
  } catch (error) {
    next (error);
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
    const hotel = await Hotel.findById (req.params.id).populate ('location');
    if (!hotel) {
      res.status (404);
      throw new Error ('There is no hotel by this ID');
    }
    res.status (200).json (hotel);
  } catch (error) {
    next (error);
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
    const newHotel = new Hotel ({
      name,
      property_type,
      star_rating,
      num_rooms,
      images,
      location,
      review,
    });
    if (!name) {
      res.status (404);
      throw new Error ('Name is required');
    }
    if (!star_rating) {
      res.status (404);
      throw new Error ('Star Rating is required');
    }
    if (!num_rooms) {
      res.status (404);
      throw new Error ('Number of Rooms is required');
    }
    if (!images) {
      res.status (404);
      throw new Error ('Images are required');
    }
    if (!location) {
      res.status (404);
      throw new Error ('Location is required');
    }
    const savedHotel = await newHotel.save ();
    res.status (200).json (savedHotel);
  } catch (error) {
    next (error);
  }
};

/**
 * @function updateHotel
 * @description Updates an existing hotel's details in the database based on the provided ID and fields.
 * @route PUT /api/hotels/:id
 * @access Public
 * @returns {JSON} JSON object representing the updated hotel.
 * @throws {Error} If no hotel is found with the provided ID or if no fields are provided for updating.
 *
 * This function accepts updated hotel details in the request body and updates the corresponding hotel
 * document in the database using the provided hotel ID. If no fields are provided to update, it responds
 * with a 400 status code and an error message. Upon successful update, it returns the updated hotel as a JSON object.
 */
const updateHotel = async (req, res, next) => {
  try {
    const {
      name,
      property_type,
      star_rating,
      num_rooms,
      images,
      location,
    } = req.body;
    const updateField = {};

    if (name) updateField.name = name;
    if (property_type) updateField.property_type = property_type;
    if (star_rating) updateField.star_rating = star_rating;
    if (num_rooms) updateField.num_rooms = num_rooms;
    if (images) updateField.images = images;
    if (location) updateField.location;
    if (Object.keys (updateField).length === 0) {
      res.status (400);
      throw new Error ('Please provide fields to update');
    }
    const hotel = await Hotel.findByIdAndUpdate (
      req.params.id,
      {$set: updateField},
      {new: true}
    );
    if (!hotel) {
      res.status (404);
      throw new Error ('There is no hotel by this ID');
    }
    return res.status (200).json (hotel);
  } catch (error) {
    next (error);
  }
};

/**
 * @function deleteHotel
 * @description Deletes a hotel from the database based on the provided ID.
 * @route DELETE /api/hotels/:id
 * @access Public
 * @returns {JSON} JSON object of the deleted hotel.
 * @throws {Error} If no hotel is found with the provided ID.
 *
 * This function accepts a hotel ID as a URL parameter, deletes the corresponding hotel document
 * from the database, and returns the deleted hotel as a JSON object. If no hotel is found
 * with the provided ID, it responds with a 404 status code and an error message.
 */
const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndDelete (req.params.id);
    if (!hotel) {
      res.status (404);
      throw new Error ('There is no hotel by this ID');
    }
    res.status (200).json (hotel);
  } catch (error) {
    next (error);
  }
};

/**
 * @function getHotelsFromLocation
 * @description Retrieves a list of hotels based on the specified location ID.
 * @route GET /api/hotels/location/:id
 * @access Public
 * @returns {JSON} JSON object containing the list of hotels in the specified location.
 * @throws {Error} If no hotels are found in the specified location.
 *
 * This function accepts a location ID as a URL parameter, queries the database for hotels
 * in that location, and returns the list of hotels as a JSON object. Each hotel in the result
 * includes its associated reviews through population. If no hotels are found, it responds
 * with a 404 status code and an error message.
 */
const getHotelsFromLocation = async (req, res, next) => {
  try {
    const hotels = await Hotel.find ({location: req.params.id}).populate (
      'review'
    );
    if (!hotels.length === 0) {
      res.status (404);
      throw new Error ('There are no hotels available in this location');
    }
    res.status (200).json ({
      success: true,
      message: 'Hotels retrieved successfully',
      data: hotels,
    });
  } catch (error) {
    next (error);
  }
};

module.exports = {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  getHotelsFromLocation,
};
