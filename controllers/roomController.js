const Room = require("../models/room");

/**
 * @function getRooms
 * @description Retrieves all rooms available in the database.
 * @route GET /api/rooms
 * @access Public
 * @returns {JSON} JSON object containing an array of all rooms.
 * @throws {Error} If no rooms are available.
 *
 * This function fetches all rooms and populates the related hotel and amenities details.
 * If no rooms are found, it throws an error.
 */
const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find().populate("hotel").populate("amenities");
    if (!rooms) {
      res.status(404);
      throw new Error("There are no rooms available");
    }
    return res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};

/**
 * @function getRoom
 * @description Retrieves a single room by its ID.
 * @route GET /api/rooms/:id
 * @access Public
 * @param {string} id - The ID of the room to retrieve.
 * @returns {JSON} JSON object containing the room details, including related hotel and amenities.
 * @throws {Error} If no room is found with the provided ID.
 *
 * This function fetches a single room by its ID and populates the related hotel and amenities details.
 * If the room with the provided ID does not exist, it throws an error.
 */
const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate("hotel")
      .populate("amenities");
    if (!room) {
      res.status(404);
      throw new Error("There is no room by this ID");
    }
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

/**
 * @function createRoom
 * @description Creates a new room in the database.
 * @route POST /api/rooms
 * @access Private
 * @returns {JSON} JSON object containing the newly created room.
 * @throws {Error} If any required field is missing.
 *
 * This function validates the required fields (room type, number, price, status, hotel, and amenities)
 * and saves a new room to the database. If any field is missing, an error is thrown with the appropriate message.
 */
const createRoom = async (req, res, next) => {
  try {
    const { room_type, room_number, price, status, hotel, amenities } =
      req.body;
    const newRoom = new Room({
      room_type,
      room_number,
      price,
      status,
      hotel,
      amenities,
    });
    if (!room_type) {
      res.status(404);
      throw new Error("Room Type is required");
    }
    if (!room_number) {
      res.status(404);
      throw new Error("Room Number is required");
    }
    if (!price) {
      res.status(404);
      throw new Error("Price is required");
    }
    if (!status) {
      res.status(404);
      throw new Error("Status is required");
    }
    if (!hotel) {
      res.status(404);
      throw new Error("Hotel is required");
    }
    if (!amenities) {
      res.status(404);
      throw new Error("Amenities is required");
    }
    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRooms,
  getRoom,
  createRoom,
};
