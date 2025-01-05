const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const corn = require("node-cron");
const discountRoute = require("./routes/discountRoute");
const bookingRoute = require("./routes/bookingRoute");
const amenityRoute = require("./routes/amenityRoute");
const hotelRoutes = require("./routes/hotelRoutes");
const locationRoutes = require("./routes/locationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const roomRoutes = require("./routes/roomRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
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
app.use("/api/hotels", hotelRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes)

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
