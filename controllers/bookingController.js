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
      return res
        .status(400)
        .json({ message: "Please provide fields to update." });
    }
    for (let i in updateField) {
      if (
        updateField[i] === undefined ||
        updateField[i] === null ||
        updateField[i].toString().trim() === ""
      ) {
        return res.status(400).json({
          message: `${i.charAt(0).toUpperCase() + i.slice(1)} is required.`,
        });
      }
    }
    const findBooking = await Booking.findById(req.params.id);
    if (!findBooking) {
      return res
        .status(404)
        .json({ message: `No booking found with this ID: ${req.params.id}` });
    }
    if (check_in || check_out || room) {
      const total_price = await calculateTotalPrice(
        room || findBooking.room,
        check_in || findBooking.check_in,
        check_out || findBooking.check_out
      );
      updateField.total_price = total_price;
    }
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: updateField },
      { new: true }
    );
    if (!booking) {
      return res
        .status(404)
        .json({ message: `No booking found with this ID: ${req.params.id}` });
    }
    res.status(200).json({
      success: true,
      message: "Booking successfully updated.",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
