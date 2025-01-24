const { describe, it, expect } = require("@jest/globals");
const { deleteBooking } = require("../../controllers/bookingController");
const Booking = require("../../models/bookingModel");

jest.mock("../../models/bookingModel");

describe("deleteBooking Controller", () => {
  it("should return a 400 error if the booking is not found", async () => {
    Booking.findByIdAndDelete.mockResolvedValue(null);

    const req = {
      params: { id: "123" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await deleteBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "no booking with this id123" })
    );
  });

  it("should return a 200 status and the deleted booking if the booking is found and deleted", async () => {
    const mockBooking = {
      _id: "123",
      check_in: new Date(),
      check_out: new Date(),
      total_price: 100,
      user: "User 1",
      hotel: "Hotel 1",
      room: "Room 1",
    };

    Booking.findByIdAndDelete.mockResolvedValue(mockBooking);

    const req = {
      params: { id: "123" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await deleteBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Booking successfully Deleted.",
      data: mockBooking,
    });
  });

  it("should handle unexpected errors and pass them to the next middleware", async () => {
    const error = new Error("Unexpected error");

    Booking.findByIdAndDelete.mockRejectedValue(error);

    const req = {
      params: { id: "123" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await deleteBooking(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
