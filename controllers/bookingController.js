const Booking = require("../models/bookingModel");
const Room = require("../models/roomModel");

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
    const { check_in, check_out, status, user, hotel, room, discount } =
      req.body;
    const requiredFields = {
      check_in,
      check_out,
      status,
      user,
      hotel,
      room,
    };

    for (let i in requiredFields) {
      if (!requiredFields[i]) {
        res.status(400);
        throw new Error(
          `${i.charAt(0).toUpperCase() + i.slice(1)} Is Required`
        );
      }
    }
    const total_price = await calculateTotalPrice(room, check_in, check_out);
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
    console.log("Booking created successfully");
  } catch (error) {
    next(error);
  }
};

const updateBooking = async (req, res, next) => {
  try {
    const { check_in, check_out, status, hotel, room, discount } = req.body;
    const updateField = {};
    if (check_in) updateField.check_in = check_in;
    if (check_out) updateField.check_out = check_out;
    if (status) updateField.status = status;
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
    const findBooking = await Booking.findById(req.params.id);
    if (check_in || check_out || room) {
      const total_price = await calculateTotalPrice(
        findBooking.room,
        findBooking.check_in,
        findBooking.check_out
      );
      updateField.total_price = total_price;
    }
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: updateField },
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

const calculateTotalPrice = async (rooom, check_in, check_out) => {
  try {
    const room = await Room.findById(rooom);
    if (!room) {
      throw new Error("Invalid room");
    }
    if (room && check_in && check_out) {
      const checkInDate = new Date(check_in);
      const checkOutDate = new Date(check_out);
      if (isNaN(checkInDate) || isNaN(checkOutDate)) {
        throw new Error("Invalid check-in or check-out date");
      }
      if (checkInDate >= checkOutDate) {
        throw new Error("Check-out date must be greater than check-in date");
      }
      const nights = Math.ceil(
        (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
      );
      return room.price * nights;
    }
  } catch (error) {
    console.error("Error calculating total price:", error);
    throw error;
  }
};

module.exports = {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  calculateTotalPrice,
};
