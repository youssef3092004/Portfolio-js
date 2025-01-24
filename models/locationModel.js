const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const locationSchema = mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
    immutable: true,
  },
  country: {
    type: String,
    required: true,
    maxlength: 100,
  },
  city: {
    type: String,
    required: true,
    maxlength: 100,
  },
  address: {
    type: String,
    required: true,
    maxlength: 255,
  },
  zip_code: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;
