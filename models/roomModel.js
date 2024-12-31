const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const roomSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
    immutable: true,
  },
  room_type: {
    type: String,
    enum: ["Single", "Double", "Triple", "Suite", "Deluxe"],
    default: "Single",
  },
  room_number: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Available", "Booked", "Under Maintenance"],
    default: "Available",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  amenities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Amenity",
    },
  ],
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
