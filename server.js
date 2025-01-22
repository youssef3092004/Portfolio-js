require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const corn = require("node-cron");
const session = require('express-session');
const passport = require("passport");
require('./config/passportSetup');
const { swaggerUi, swaggerDocs } = require("./config/swaggerConfig");
const { updateDiscountStatuses } = require("./controllers/discountController");

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
const resetPassword = require("./routes/resetPasswordRoutes");
const cors = require('cors');

const DB_PORT = process.env.DB_PORT || 3000;

connectDB();

const app = express();
app.use(express.json());
// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    // Ensure cookie is secure in production (HTTPS)
    secure: process.env.ENV === 'production',
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(errorHandler);
app.use(cors({
  origin: ['http://localhost:3000', 'https://bookify-portfolio.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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
app.use("/api/auth", authRoutes);
app.use("/api/auth", resetPassword);
console.log(swaggerDocs);  // Ensure the docs are being generated correctly

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  swaggerUrl: 'https://bookify-portfolio.vercel.app/swagger.json'  // Specify your swagger JSON URL explicitly
}));
app.get("/", (req, res) => {
  res.send("Welcome to home page");
});
// Serve Swagger JSON at /swagger.json
app.get('/swagger.json', (req, res) => {
  res.json(swaggerDocs);
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
console.log('Node.js Version:', process.version);

app.listen(DB_PORT, () => {
  console.log(`Server is listening on port ${DB_PORT}`);
  console.log('Swagger Docs available at http://localhost:3000/api-docs')
});
