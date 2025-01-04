/**
 * @file reviewRoutes.js
 * @desc Defines routes for managing reviews in the application.
 * @module routes/reviewRoutes
 * @requires express
 * @requires ../controllers/reviewController
 *
 * This file sets up the routes for the CRUD operations related to reviews.
 * It maps HTTP methods (GET, POST, PUT, DELETE) to corresponding controller functions.
 */

const { Router } = require("express");
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const router = Router();

/**
 * @route GET /api/reviews
 * @desc Retrieve a list of all reviews.
 * @access Public
 * @returns {Array} List of all reviews.
 */
router.get("/", getReviews);

/**
 * @route GET /api/reviews/:id
 * @desc Retrieve a specific review by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the review.
 * @returns {Object} The review corresponding to the provided ID.
 */
router.get("/:id", getReview);

/**
 * @route POST /api/reviews
 * @desc Create a new review.
 * @access Public
 * @param {Object} reviewDetails - The details of the review.
 * @param {string} reviewDetails.user - The user who wrote the review.
 * @param {string} reviewDetails.comment - The content of the review.
 * @param {number} reviewDetails.rating - The rating given in the review (e.g., 1 to 5).
 * @param {string} reviewDetails.productId - The ID of the product or service being reviewed.
 * @returns {Object} The newly created review.
 */
router.post("/", createReview);

/**
 * @route PUT /api/reviews/:id
 * @desc Update an existing review by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the review.
 * @param {Object} updatedReview - The updated review details.
 * @returns {Object} The updated review.
 */
router.put("/:id", updateReview);

/**
 * @route DELETE /api/reviews/:id
 * @desc Delete a review by its ID.
 * @access Public
 * @param {string} id - The unique identifier for the review.
 * @returns {Object} A message indicating the review has been deleted.
 */
router.delete("/:id", deleteReview);

module.exports = router;
