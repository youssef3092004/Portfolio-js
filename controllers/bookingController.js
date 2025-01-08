const Booking = require("../models/booking");

const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("user")
      .populate("hotel")
      .populate("room")
      .populate("discount");
    if (!bookings) {
      res.status(404);
      throw new Error("There are no bookings available");
    }
    return res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user")
      .populate("hotel")
      .populate("room")
      .populate("discount")
      .exec();
    if (!booking) {
      return res
        .status(404)
        .json({ message: "There is no booking by this ID" });
    }
    res.status(200).json({
      success: true,
      message: "Booking retrieved successfully.",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
