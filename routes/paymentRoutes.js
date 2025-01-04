/**
 * @file paymentRoutes.js
 * @desc Defines routes for managing payments in the application.
 * @module routes/paymentRoutes
 * @requires express
 * @requires ../controllers/paymentController
 *
 * This file sets up the routes for the CRUD operations related to payments.
 * It maps HTTP methods (GET, POST, PUT, DELETE) to corresponding controller functions.
 */

const { Router } = require("express");
const {
  createPayment,
  getPayments,
  getPayment,
  updatePayment,
  deletePayment,
} = require("../controllers/paymentController");

const router = Router();

/**
 * @route GET /api/payments
 * @desc Retrieve a list of all payments.
 * @access Public
 * @returns {Array} List of all payments.
 */
router.get("/", getPayments);

/**
 * @route GET /api/payments/:id
 * @desc Retrieve a specific payment by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the payment.
 * @returns {Object} The payment corresponding to the provided ID.
 */
router.get("/:id", getPayment);

/**
 * @route POST /api/payments
 * @desc Create a new payment.
 * @access Public
 * @param {Object} paymentDetails - The details of the payment.
 * @param {string} paymentDetails.amount - The amount of the payment.
 * @param {string} paymentDetails.method - The payment method (e.g., credit card, PayPal).
 * @param {string} paymentDetails.transactionId - The unique transaction ID for the payment.
 * @param {string} paymentDetails.date - The date of the payment.
 * @returns {Object} The newly created payment.
 */
router.post("/", createPayment);

/**
 * @route PUT /api/payments/:id
 * @desc Update an existing payment by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the payment.
 * @param {Object} updatedPayment - The updated payment details.
 * @returns {Object} The updated payment.
 */
router.put("/:id", updatePayment);

/**
 * @route DELETE /api/payments/:id
 * @desc Delete a payment by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the payment.
 * @returns {Object} A message indicating the payment has been deleted.
 */
router.delete("/:id", deletePayment);

module.exports = router;
