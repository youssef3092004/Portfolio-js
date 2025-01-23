/**
 * @file connectDB.js
 * @description Handles the connection to the MongoDB database using Mongoose.
 * @module config/connectDB
 * @requires mongoose
 * @requires process.env
 */

const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

/**
 * @function connectDB
 * @desc Establishes a connection to the MongoDB database using the Mongoose library.
 *       Logs a success message on a successful connection and handles errors by exiting the process.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};
module.exports = connectDB;
