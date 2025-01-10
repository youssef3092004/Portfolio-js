const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/bookingModel");
const Hotel = require("../models/hotelModel");
require("dotenv").config();

/**
 * @function checkout
 * @description Initiates the checkout process for a hotel booking, creating a Stripe session for payment.
 * @route POST /api/checkout
 * @access Public
 * @returns {JSON} JSON object containing the URL for the Stripe checkout session.
 * @throws {Error} If the booking or hotel is not found, if booking dates are invalid, or if there's an error during session creation.
 * 
 * This function processes a booking ID from the request body to retrieve booking details from the database.
 * It validates the booking dates and calculates the number of nights for the stay. If the booking is valid, 
 * it creates a Stripe checkout session with pricing information based on the room's price and the number of nights.
 * The session URL is returned for the user to complete the payment.
 * 
 * Errors include:
 * - 404 if the booking or hotel is not found.
 * - 400 if the booking dates are invalid.
 */
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
