const Booking = require("../models/booking");

const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("user")
      .populate("hotel")
      .populate("room")
      .populate("discount")
      .exec();
    if (!bookings || bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "There is no bookings by this ID" });
    }
    res.status(200).json({
      success: true,
      message: "Booking retrieved successfully.",
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};
