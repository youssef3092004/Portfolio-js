const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const amenitySchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
    immutable: true,
  },
  name: { 
    type: String,
    required: true,
    maxlength: 100,
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
});

const Amenity = mongoose.model("Amenity", amenitySchema);
module.exports = Amenity;
