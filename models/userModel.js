const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
    immutable: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
  },
  fname: {
    type: String,
    required: true,
    maxlength: 100,
  },
  lname: {
    type: String,
    required: true,
    maxlength: 100,
  },
  address: {
    type: String,
    required: true,
    maxlength: 100,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    maxlength: 15,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
    maxlength: 100,
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

const User = mongoose.model("User", userSchema);
module.exports = User;
