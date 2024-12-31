const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const bookingSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
    immutable: true,
  },
  check_in: {
    type: Date,
    required: true,
  },
  check_out: {
    type: Date,
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Confirmed", "Cancelled"],
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
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  discount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Discount",
  },
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
