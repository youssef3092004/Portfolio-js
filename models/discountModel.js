const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const discountSchema = mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
    immutable: true,
  },
  code: {
    type: String,
    required: true,
    maxlength: 20,
  },
  discount: {
    type: Number,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  maxUse: {
    type: Number,
    required: true,
  },
});

const Discount = mongoose.model("Discount", discountSchema);
module.exports = Discount;
