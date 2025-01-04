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

module.exports = {
  getReviews,
};
