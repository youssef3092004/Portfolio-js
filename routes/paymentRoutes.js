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
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Retrieve a list of all payments
 *     tags: [Payments]
 *     description: Get a list of all available payments.
 *     responses:
 *       200:
 *         description: A list of all payments.
 *       500:
 *         description: Internal server error.
 */
router.get("/", getPayments);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Retrieve a specific payment by its ID
 *     tags: [Payments]
 *     description: Get a specific payment using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the payment.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The payment corresponding to the provided ID.
 *       404:
 *         description: Payment not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", getPayment);

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     description: Add a new payment with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payment_method
 *               - status
 *               - user
 *               - booking
 *             properties:
 *               payment_method:
 *                 type: string
 *                 description: The method of payment (e.g., credit card, PayPal).
 *               status:
 *                 type: string
 *                 description: The status of the payment (e.g., pending, completed).
 *               user:
 *                 type: string
 *                 description: The ID of the user who made the payment.
 *               booking:
 *                 type: string
 *                 description: The ID of the associated booking.
 *     responses:
 *       201:
 *         description: The newly created payment.
 *       500:
 *         description: Internal server error.
 */
router.post("/", createPayment);

/**
 * @swagger
 * /api/payments/{id}:
 *   put:
 *     summary: Update an existing payment by its ID
 *     tags: [Payments]
 *     description: Update the details of an existing payment using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the payment.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payment_method:
 *                 type: string
 *                 description: The method of payment (e.g., credit card, PayPal).
 *               status:
 *                 type: string
 *                 description: The status of the payment (e.g., pending, completed).
 *               user:
 *                 type: string
 *                 description: The ID of the user who made the payment.
 *               booking:
 *                 type: string
 *                 description: The ID of the associated booking.
 *     responses:
 *       200:
 *         description: The updated payment.
 *       404:
 *         description: Payment not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", updatePayment);

/**
 * @swagger
 * /api/payments/{id}:
 *   delete:
 *     summary: Delete a payment by its ID
 *     tags: [Payments]
 *     description: Delete a payment using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the payment.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A success message indicating the payment has been deleted.
 *       404:
 *         description: Payment not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", deletePayment);

module.exports = router;
