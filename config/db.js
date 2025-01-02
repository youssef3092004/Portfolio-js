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

// const DATABASE = process.env.DB_DATABASE || "myDatabase";
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || "27017";
const DATABASE = process.env.DB_DATABASE || "Bookify";

let MONGO_URI;

if (!USERNAME || !PASSWORD) {
  MONGO_URI = `mongodb://${HOST}:${PORT}/${DATABASE}?retryWrites=true&w=majority`;
} else {
  MONGO_URI = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.jyduv.mongodb.net/myDatabase?retryWrites=true&w=majority`;
}

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
