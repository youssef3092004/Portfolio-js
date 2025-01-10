const Review = require("../models/reviewModel");

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
    const reviews = await Review.find()
      .populate("user")
      .populate("hotel")
      .exec();
    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "There are no reviews available" });
    }
    res.status(200).json(reviews);
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
      .populate("hotel")
      .exec();
    if (!review || review.length === 0) {
      return res.status(404).json({ message: "There is no review by this ID" });
    }
    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
};

/**
 * @function createReview
 * @description Creates a new review for a hotel.
 * @route POST /api/reviews
 * @access Private
 * @returns {JSON} JSON object containing the newly created review.
 * @throws {Error} If any required field is missing.
 *
 * This function validates the required fields and saves a new review
 * to the database.
 */
const createReview = async (req, res, next) => {
  try {
    const { rating, description, user, hotel } = req.body;
    const newReview = new Review({
      rating,
      description,
      user,
      hotel,
    });
    if (!rating) {
      res.status(404);
      throw new Error("Rating is required");
    }
    if (!description) {
      res.status(404);
      throw new Error("Description is required");
    }
    if (!user) {
      res.status(404);
      throw new Error("User is required");
    }
    if (!hotel) {
      res.status(404);
      throw new Error("Hotel is required");
    }
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    next(error);
  }
};

/**
 * @function updateReview
 * @description Updates an existing review for a hotel.
 * @route PUT /api/reviews/:id
 * @access Private
 * @returns {JSON} - JSON object containing the updated review.
 * @throws {Error} - If no fields are provided for update or if the review is not found.
 *
 * This function validates the provided fields, updates the review in the database,
 * and returns the updated review as a response.
 */
const updateReview = async (req, res, next) => {
  try {
    const { rating, description, user, hotel } = req.body;
    const updateField = {};

    if (rating) updateField.rating = rating;
    if (description) updateField.description = description;
    if (user) updateField.user = user;
    if (hotel) updateField.hotel = hotel;
    if (Object.keys(updateField).length === 0) {
      res.status(400);
      throw new Error("No fields provided for update");
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: updateField },
      { new: true }
    );
    if (!review) {
      res.status(404);
      throw new Error("Cannot Update The Review");
    }
    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
};

/**
 * @function deleteReview
 * @description Deletes an existing review for a hotel.
 * @route DELETE /api/reviews/:id
 * @access Private
 * @param {string} req.params.id - The ID of the review to be deleted (required).
 * @returns {JSON} - JSON object containing the deleted review.
 * @throws {Error} - If the review is not found or cannot be deleted.
 *
 * This function attempts to delete the specified review from the database.
 * If the review is not found, it throws an error.
 */
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      res.status(404);
      throw new Error("Cannot Delete The Review");
    }
    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};
