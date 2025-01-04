const Hotel = require("../models/hotel");

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

module.exports = { getHotels };
