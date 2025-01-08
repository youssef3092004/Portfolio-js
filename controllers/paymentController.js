const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/bookingModel");
const Hotel = require("../models/hotelModel");
require("dotenv").config();

const checkout = async (req, res, next) => {
  try {
    const bookingId = req.body.bookingId;
    const booking = await Booking.findById(bookingId).populate("room");

    if (!booking) {
      const error = new Error(`Booking not found with id of ${bookingId}`);
      error.statusCode = 404;
      return next(error);
    }

    const nights =
      (booking.check_out - booking.check_in) / (1000 * 60 * 60 * 24);

    if (nights <= 0 || isNaN(nights)) {
      const error = new Error(
        "Invalid booking dates. Check-in date must be before check-out date, and the duration must be a valid number of nights."
      );
      error.statusCode = 400;
      return next(error);
    }
    const hotel = await Hotel.findById(booking.hotel);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: `Hotel not found with id of ${booking.hotel}`,
      });
    }
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Booking for Hotel: ${hotel.name} - Room: ${booking.room.room_type}`,
              description: `Check-in: ${booking.check_in} - Check-out: ${booking.check_out}`,
            },
            unit_amount: booking.room.price * 100,
          },
          quantity: nights,
        },
      ],
      mode: "payment",
      success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
    });

    return res.status(200).json({
      success: true,
      data: session.url,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { checkout };
