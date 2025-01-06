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
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Retrieve a list of all reviews
 *     tags: [Reviews]
 *     description: Get a list of all available reviews.
 *     responses:
 *       200:
 *         description: A list of all reviews.
 *       500:
 *         description: Internal server error.
 */
router.get("/", getReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Retrieve a specific review by its ID
 *     tags: [Reviews]
 *     description: Get a specific review using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the review.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The review corresponding to the provided ID.
 *       404:
 *         description: Review not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", getReview);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     description: Add a new review with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - description
 *               - user
 *               - hotel
 *             properties:
 *               rating:
 *                 type: number
 *                 description: The rating given in the review (e.g., 1 to 5).
 *               description:
 *                 type: string
 *                 description: A brief description of the review.
 *               user:
 *                 type: string
 *                 description: The ID of the user who submitted the review.
 *               hotel:
 *                 type: string
 *                 description: The ID of the hotel being reviewed.
 *     responses:
 *       201:
 *         description: The newly created review.
 *       500:
 *         description: Internal server error.
 */
router.post("/", createReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update an existing review by its ID
 *     tags: [Reviews]
 *     description: Update the details of an existing review using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the review.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 description: The rating given in the review (e.g., 1 to 5).
 *               description:
 *                 type: string
 *                 description: A brief description of the review.
 *               user:
 *                 type: string
 *                 description: The ID of the user who submitted the review.
 *               hotel:
 *                 type: string
 *                 description: The ID of the hotel being reviewed.
 *     responses:
 *       200:
 *         description: The updated review.
 *       404:
 *         description: Review not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review by its ID
 *     tags: [Reviews]
 *     description: Delete a review using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the review.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A success message indicating the review has been deleted.
 *       404:
 *         description: Review not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", deleteReview);

module.exports = router;
