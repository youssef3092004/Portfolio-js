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
        return res.status(400).json({
          message: `${i.charAt(0).toUpperCase() + i.slice(1)} is required`,
        });
      }
    }

    let total_price = await calculateTotalPrice(room, check_in, check_out);
    console.log("total price", total_price);

    if (discount) {
      await checkDiscountActiveOrInactive(discount);
      total_price = await calculate_total_price_after_discount(
        discount,
        total_price
      );
      await incrementDiscountUsage(discount);
      console.log("total price after discount", total_price);
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
    res.status(200).json({
      success: true,
      message: "Booking successfully Created.",
      data: savedBooking,
    });
    console.log("Booking created successfully");
  } catch (error) {
    next(error);
  }
};
