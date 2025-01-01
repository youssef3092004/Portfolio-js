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
      .populate("discount");
    if (!booking) {
      res.status(404);
      throw new Error("There is no booking by this ID");
    }
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

createBooking = async (req, res, next) => {
  try {
    const {
      check_in,
      check_out,
      total_price,
      status,
      user,
      hotel,
      room,
      discount,
    } = req.body;
    const requiredFields = {
      check_in,
      check_out,
      total_price,
      status,
      user,
      hotel,
      room,
      discount,
    };
    for (let i in requiredFields) {
      if (!requiredFields[i]) {
        res.status(400);
        throw new Error(
          `${i.charAt(0).toUpperCase() + i.slice(1)} Is Required`
        );
      }
    }
    const newBooking = new Booking({
      check_in,
      check_out,
      total_price,
      status,
      user,
      hotel,
      room,
      discount,
    });
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    next(error);
  }
};
