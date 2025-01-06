/**
 * @file discountRoutes.js
 * @desc Defines routes for managing discount resources in the application.
 * @module routes/discountRoutes
 * @requires express
 * @requires ../controllers/discountController
 * 
 * This file sets up the routes for the CRUD operations related to discounts.
 * It maps HTTP methods (GET, POST, PUT, DELETE) to corresponding controller functions.
 */

const { Router } = require("express");
const {
  getDiscounts,
  getDiscount,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} = require("../controllers/discountController");

const router = Router();

/**
 * @swagger
 * /api/discounts:
 *   get:
 *     summary: Retrieve a list of all discounts
 *     tags: [Discounts]
 *     description: Get a list of all available discounts.
 *     responses:
 *       200:
 *         description: A list of all discounts.
 *       500:
 *         description: Internal server error.
 */
router.get("/", getDiscounts);

/**
 * @swagger
 * /api/discounts/{id}:
 *   get:
 *     summary: Retrieve a specific discount by its ID
 *     tags: [Discounts]
 *     description: Get a specific discount using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the discount.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The discount corresponding to the provided ID.
 *       404:
 *         description: Discount not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", getDiscount);

/**
 * @swagger
 * /api/discounts:
 *   post:
 *     summary: Create a new discount
 *     tags: [Discounts]
 *     description: Add a new discount with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discount
 *               - start_date
 *               - end_date
 *               - status
 *             properties:
 *               code:
 *                 type: string
 *                 description: The unique discount code.
 *               discount:
 *                 type: number
 *                 description: The percentage of the discount.
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 description: The start date of the discount.
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 description: The expiry date of the discount.
 *               status:
 *                 type: string
 *                 description: The status of the discount (e.g., active, expired).
 *               maxUse:
 *                 type: number
 *                 description: The maximum number of times the discount can be used.
 *     responses:
 *       201:
 *         description: The newly created discount.
 *       500:
 *         description: Internal server error.
 */
router.post("/", createDiscount);

/**
 * @swagger
 * /api/discounts/{id}:
 *   put:
 *     summary: Update an existing discount by its ID
 *     tags: [Discounts]
 *     description: Update the details of an existing discount using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the discount.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: The unique discount code.
 *               discount:
 *                 type: number
 *                 description: The percentage of the discount.
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 description: The start date of the discount.
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 description: The expiry date of the discount.
 *               status:
 *                 type: string
 *                 description: The status of the discount (e.g., active, expired).
 *               maxUse:
 *                 type: number
 *                 description: The maximum number of times the discount can be used.
 *     responses:
 *       200:
 *         description: The updated discount.
 *       404:
 *         description: Discount not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", updateDiscount);

/**
 * @swagger
 * /api/discounts/{id}:
 *   delete:
 *     summary: Delete a discount by its ID
 *     tags: [Discounts]
 *     description: Delete a discount using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the discount.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A success message indicating the discount has been deleted.
 *       404:
 *         description: Discount not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", deleteDiscount);

module.exports = router;
