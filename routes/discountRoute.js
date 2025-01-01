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
 * @route GET /api/discounts
 * @desc Retrieve a list of all discounts.
 * @access Public
 * @returns {Array} List of all discounts.
 */
router.get("/", getDiscounts);

/**
 * @route GET /api/discounts/:id
 * @desc Retrieve a specific discount by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the discount.
 * @returns {Object} The discount corresponding to the provided ID.
 */
router.get("/:id", getDiscount);

/**
 * @route POST /api/discounts
 * @desc Create a new discount.
 * @access Public
 * @param {string} code - The unique discount code.
 * @param {number} percentage - The percentage of discount.
 * @param {Date} valid_until - The expiry date of the discount.
 * @returns {Object} The newly created discount.
 */
router.post("/", createDiscount);

/**
 * @route PUT /api/discounts/:id
 * @desc Update an existing discount by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the discount.
 * @param {Object} updatedFields - The fields to update (e.g., code, percentage, valid_until).
 * @returns {Object} The updated discount.
 */
router.put("/:id", updateDiscount);

/**
 * @route DELETE /api/discounts/:id
 * @desc Delete a discount by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the discount.
 * @returns {Object} A message indicating the discount has been deleted.
 */
router.delete("/:id", deleteDiscount);

module.exports = router;
