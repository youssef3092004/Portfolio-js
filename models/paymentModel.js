const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const paymentSchema = mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    required: true,
    immutable: true,
  },
  payment_mathond: {
    type: String,
    enum: ["Credit Card", "Debit Card", "PayPal"],
    default: "Credit Card",
  },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
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
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
});

paymentSchema.virtual("total_price").get(function () {
  return this.booking ? this.booking.total_price : null;
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
