const { describe, it, expect } = require("@jest/globals");
const { createBooking } = require("../../controllers/bookingController");
const Booking = require("../../models/bookingModel");


jest.mock("../../models/bookingModel", () => {
  return jest.fn().mockImplementation(() => {
    return {
      save: jest.fn().mockResolvedValue({
        _id: "booking123",
        check_in: "2025-01-10",
        check_out: "2025-01-15",
        total_price: 1000,
        status: "Confirmed",
        user: "user123",
        hotel: "hotel123",
        room: "room123",
        discount: "discount123",
      }),
    };
  });
});

jest.mock("../../controllers/discountController", () => ({
  checkDiscountActiveOrInactive: jest.fn().mockResolvedValue(true),
  incrementDiscountUsage: jest.fn().mockResolvedValue(),
}));

const {
  checkDiscountActiveOrInactive,
  incrementDiscountUsage,
} = require("../../controllers/discountController");

describe("createBooking Controller", () => {
  it("should return a 400 error if any required field is missing", async () => {
    const req = {
      body: {
        check_in: new Date(),
        check_out: new Date(),
        user: "User 1",
        hotel: "Hotel 1",
        room: "Room 1",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await createBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Status is required",
    });
  });

  it("should return a 200 status and the created booking if all fields are provided", async () => {
    const mockBooking = {
      _id: "123",
      check_in: new Date(),
      check_out: new Date(),
      total_price: 100,
      status: "Confirmed",
      user: "User 1",
      hotel: "Hotel 1",
      room: "Room 1",
      discount: "Discount 1",
    };

    Booking.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockBooking),
    }));

    const req = {
      body: mockBooking,
    };

    const res = {
      status: jest.fn().mockReturnThis(),N
      json: jest.fn(),
    };

    const next = jest.fn();

    await createBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Booking successfully Created.",
      data: mockBooking,
    });
  });

  it("should handle unexpected errors and pass them to the next middleware", async () => {
    const error = new Error("Unexpected error");

    Booking.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(error),
    }));

    const req = {
      body: {
        check_in: new Date(),
        check_out: new Date(),
        status: "Confirmed",
        user: "User 1",
        hotel: "Hotel 1",
        room: "Room 1",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await createBooking(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
