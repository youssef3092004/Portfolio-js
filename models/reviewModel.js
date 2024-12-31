const mongoose = require("mongoose");

const { v4: uuidv4 } = require("uuid");

const reviewSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
    immutable: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  description: {
    type: String,
    required: true,
    maxlength: 200,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
