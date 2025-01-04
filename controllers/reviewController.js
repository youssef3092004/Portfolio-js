const Review = require("../models/review");

/**
 * @function getReviews
 * @description Retrieves all reviews from the database.
 * @route GET /api/reviews
 * @access Public
 * @returns {JSON} JSON array of all reviews with user and hotel details populated.
 * @throws {Error} If no reviews are found.
 *
 * This function fetches all reviews from the database and populates related
 * user and hotel data for each review.
 */
const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().populate("user").populate("hotel");
    if (!reviews) {
      res.status(404);
      throw new Error("There are no reviews available");
    }
    return res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

/**
 * @function getReview
 * @description Retrieves a specific review by its ID.
 * @route GET /api/reviews/:id
 * @access Public
 * @param {string} req.params.id - The ID of the review to retrieve.
 * @returns {JSON} JSON object containing the review with user and hotel details populated.
 * @throws {Error} If the review is not found or an invalid ID is provided.
 *
 * This function fetches a single review from the database using its ID
 * and populates related user and hotel data.
 */
const getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user")
      .populate("hotel");
    if (!review) {
      res.status(404);
      throw new Error("There is no review by this ID");
    }
    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReviews,
  getReview,
};
