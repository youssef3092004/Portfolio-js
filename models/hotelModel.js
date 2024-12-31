const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const hotelSchema = mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    required: true,
    immutable: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  property_type: {
    type: String,
    default: "Hotel",
  },
  star_rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  num_rooms: {
    type: Number,
    default: 50,
  },
  images: {
    type: [String],
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
});

const Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = Hotel;
