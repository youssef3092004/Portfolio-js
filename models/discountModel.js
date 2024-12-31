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
});

discountSchema.virtual("is_active").get(function () {
  if (Date.now() < this.end_date) {
    return this.status === "Active";
  } else {
    return this.status === "Inactive";
  }
});


const Discount = mongoose.model("Discount", discountSchema);
module.exports = Discount;
