const { describe, test, expect, beforeEach } = require("@jest/globals");
const { updateBooking } = require("../../controllers/bookingController");
const Booking = require("../../models/bookingModel");
const { calculateTotalPrice } = require("../../controllers/bookingController");

jest.mock("../../models/bookingModel");
jest.mock("../../controllers/bookingController", () => ({
  ...jest.requireActual("../../controllers/bookingController"),
  calculateTotalPrice: jest.fn(),
}));

describe("updateBooking Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "123" },
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return a 400 error if no fields are provided for update", async () => {
    await updateBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Please provide fields to update.",
    });
  });

  it("should return a 400 error if a required field is empty", async () => {
    req.body = { check_in: "" };

    await updateBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Please provide fields to update.",
    });
  });

  it("should return a 404 error if the booking is not found", async () => {
    Booking.findById.mockResolvedValue(null);

    req.body = { check_in: "2025-01-08" };

    await updateBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "No booking found with this ID: 123",
    });
  });

  it("should return a 200 status and the updated booking if the update is successful", async () => {
    const mockBooking = {
      _id: "123",
      room: "Room1",
      check_in: "2025-01-07",
      check_out: "2025-01-08",
    };

    const updatedBooking = {
      _id: "123",
      room: "Room1",
      check_in: "2025-01-08",
      check_out: "2025-01-09",
      total_price: 100,
    };

    Booking.findById.mockResolvedValue(mockBooking);
    Booking.findByIdAndUpdate.mockResolvedValue(updatedBooking);
    calculateTotalPrice.mockResolvedValue(100);
    req.body = { check_in: "2025-01-08", check_out: "2025-01-09" };
    await updateBooking(req, res, next);
    expect(calculateTotalPrice).toHaveBeenCalledWith(
      mockBooking.room,
      "2025-01-08",
      "2025-01-09"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Booking successfully updated.",
      data: updatedBooking,
    });
  });

  it("should handle unexpected errors and pass them to the next middleware", async () => {
    const error = new Error("Unexpected error");
    Booking.findById.mockRejectedValue(error);

    req.body = { check_in: "2025-01-08" };

    await updateBooking(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
