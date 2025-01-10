/**
 * @module Payment Routes
 * @description Defines routes for payment-related functionality.
 * @route POST /api/checkout
 * @access Public
 *
 * This module defines the routes for processing payments, including the `/checkout` endpoint.
 * The `checkout` function is called when a POST request is made to this route. The checkout
 * process involves validating the booking details and creating a Stripe checkout session for payment.
 */

const { checkout } = require("../controllers/paymentController");

const Router = require("express");

const router = Router();

router.post("/checkout", checkout);

module.exports = router;
