const Payment = require("../models/payment");

/**
 * @function getPayments
 * @description Fetches all payments from the database, including populated user and booking details.
 * @route GET /api/payments
 * @access Public
 * @returns {JSON} JSON array of payment objects with populated user and booking details.
 * @throws {Error} If no payments are found or if the database query fails.
 * 
 * This function retrieves all payments from the database and populates associated user and booking data. 
 * If no payments are available, it responds with a 404 error.
 */
const getPayments = async (req, res, next) => {
  try {
    const payment = await Payment.find().populate("user").populate("booking");
    if (!payment) {
      res.status(404);
      throw new Error("There are no payments available");
    }
    return res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
};

/**
 * @function getPayment
 * @description Fetches a single payment by its ID, including populated user and booking details.
 * @route GET /api/payments/:id
 * @access Public
 * @returns {JSON} JSON object of the payment with populated user and booking details.
 * @throws {Error} If the payment with the specified ID is not found or if the database query fails.
 * 
 * This function retrieves a specific payment from the database based on its ID 
 * and populates associated user and booking data. If the payment does not exist, it responds with a 404 error.
 */
const getPayment = async (req, res, next) => {
    try {
      const payment = await Payment.findById(req.params.id)
        .populate("user")
        .populate("booking");
      if (!payment) {
        res.status(404);
        throw new Error("There is no payment by this ID");
      }
      return res.status(200).json(payment);
    } catch (error) {
      next(error);
    }
  };
  
/**
 * @function createPayment
 * @description Creates a new payment entry in the database.
 * @route POST /api/payments
 * @access Public
 * @returns {JSON} JSON object of the newly created payment.
 * @throws {Error} If required fields are missing or if the database query fails.
 * 
 * This function creates a new payment record using the provided details, including
 * payment method, status, user, and booking. If any required fields are missing, 
 * it responds with a 404 error.
 */
const createPayment = async (req, res, next) => {
  try {
    const { payment_mathond, status, user, booking } = req.body;
    const newPayment = new Payment({
      payment_mathond,
      status,
      user,
      booking,
    });
    if (!payment_mathond) {
      res.status(404);
      throw new Error("Payment Mathond is required");
    }
    if (!status) {
      res.status(404);
      throw new Error("Status is required");
    }
    if (!user) {
      res.status(404);
      throw new Error("User is required");
    }
    if (!booking) {
      res.status(404);
      throw new Error("Booking is required");
    }
    const savedPayment = await newPayment.save();
    res.status(200).json(savedPayment);
  } catch (error) {
    next(error);
  }
};

/**
 * @function updatePayment
 * @description Updates an existing payment entry in the database.
 * @route PUT /api/payments/:id
 * @access Public
 * @returns {JSON} JSON object of the updated payment.
 * @throws {Error} If no fields are provided for update or if the payment is not found.
 * 
 * This function updates the specified fields of a payment record based on the provided
 * request body. If no valid fields are provided or if the payment ID does not exist,
 * it returns an appropriate error.
 */
const updatePayment = async (req, res, next) => {
  try {
    const { payment_mathond, status, user, booking } = req.body;
    const updateField = {};

    if (payment_mathond) updateField.payment_mathond = payment_mathond;
    if (status) updateField.status = status;
    if (user) updateField.user = user;
    if (booking) updateField.booking = booking;
    if (Object.keys(updateField).length === 0) {
      res.status(400);
      throw new Error("No fields provided for update");
    }

    const payment = await Payment.findByIdAndUpdate(
      req.updateField,
      { $set: updateField },
      { new: true }
    );
    if (!payment) {
      res.status(400);
      throw new Error("no payment with this id" + req.params.id);
    }
    res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
};

module.exports = {
    getPayments,
    getPayment,
    createPayment,
    updatePayment,
};
