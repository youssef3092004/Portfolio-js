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
    const rooms = await Room.find().populate("hotel amenities").exec();
    if (rooms.length === 0) {
      return next({ status: 404, message: "There are no rooms available" });
    }
    res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRooms,
};
