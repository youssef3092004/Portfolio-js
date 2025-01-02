const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const corn = require("node-cron");
const discountRoute = require("./routes/discountRoute");
const bookingRoute = require("./routes/bookingRoute");
const amenityRoute = require("./routes/amenityRoute");
const { updateDiscountStatuses } = require("./controllers/discountController");
const DB_PORT = process.env.DB_PORT || 3000;

connectDB();

const app = express();
app.use(express.json());
app.use(errorHandler);

// setup Routes
app.use("/api/discounts", discountRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/amenities", amenityRoute);

app.get("/", (req, res) => {
  res.send("now you in a Hello page");
});

//todo every Hour
corn.schedule("0 * * * *", () => {
  console.log("Running scheduled job to update discount statuses...");
  updateDiscountStatuses();
});

//todo every 5 seconds for checking
// setInterval(() => {
//   console.log("Running scheduled job to update discount statuses...");
//   updateDiscountStatuses();
// }, 5000);

app.listen(DB_PORT, () => {
  console.log(`I' listening in port ${DB_PORT}`);
});
