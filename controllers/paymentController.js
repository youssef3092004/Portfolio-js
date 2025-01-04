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


module.exports = {
    getPayments,
};
