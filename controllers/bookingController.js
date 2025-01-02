const Booking = require("../models/bookingModel");
const {
  incrementDiscountUsage,
  checkDiscountActiveOrInactive,
} = require("./discountController");
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

const createBooking = async (req, res, next) => {
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
    if (discount) {
      await checkDiscountActiveOrInactive(discount);
      await incrementDiscountUsage(discount);
    }
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    next(error);
  }
};

const updateBooking = async (req, res, next) => {
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
    const updateField = {};
    if (check_in) updateField.check_in = check_in;
    if (check_out) updateField.check_out = check_out;
    if (total_price) updateField.total_price = total_price;
    if (status) updateField.status = status;
    if (user) updateField.user = user;
    if (hotel) updateField.hotel = hotel;
    if (room) updateField.room = room;
    if (discount) {
      updateField.discount = discount;
      await checkDiscountActiveOrInactive(discount);
      await incrementDiscountUsage(discount);
    }
    if (Object.keys(updateField).length === 0) {
      res.status(400);
      throw new Error("Please provide fields to update");
    }
    for (let i in updateField) {
      if (!updateField[i] || updateField[i] === "") {
        res.status(400);
        throw new Error(
          `${i.charAt(0).toUpperCase() + i.slice(1)} Is Required`
        );
      }
    }
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!booking) {
      res.status(400);
      throw new Error("no booking with this id" + req.params.id);
    }
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      res.status(400);
      throw new Error("no booking with this id" + req.params.id);
    }
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
};
