const { describe, it, expect } = require("@jest/globals");
const { calculateTotalPrice } = require("../../controllers/bookingController");
const Room = require("../../models/roomModel");

jest.mock("../../models/roomModel");

describe("calculateTotalPrice", () => {
  it("should throw an error if the room is invalid", async () => {
    Room.findById.mockResolvedValue(null);

    await expect(
      calculateTotalPrice("invalidRoomId", "2025-01-01", "2025-01-02")
    ).rejects.toThrow("Invalid room");
  });

  it("should throw an error if the check-in or check-out date is invalid", async () => {
    const mockRoom = { price: 100 };
    Room.findById.mockResolvedValue(mockRoom);

    await expect(
      calculateTotalPrice("validRoomId", "invalidDate", "2025-01-02")
    ).rejects.toThrow("Invalid check-in or check-out date");
    await expect(
      calculateTotalPrice("validRoomId", "2025-01-01", "invalidDate")
    ).rejects.toThrow("Invalid check-in or check-out date");
  });

  it("should throw an error if the check-out date is not greater than the check-in date", async () => {
    const mockRoom = { price: 100 };
    Room.findById.mockResolvedValue(mockRoom);

    await expect(
      calculateTotalPrice("validRoomId", "2025-01-02", "2025-01-01")
    ).rejects.toThrow("Check-out date must be greater than check-in date");
    await expect(
      calculateTotalPrice("validRoomId", "2025-01-01", "2025-01-01")
    ).rejects.toThrow("Check-out date must be greater than check-in date");
  });

  it("should calculate the total price correctly", async () => {
    const mockRoom = { price: 100 };
    Room.findById.mockResolvedValue(mockRoom);

    const totalPrice = await calculateTotalPrice(
      "validRoomId",
      "2025-01-01",
      "2025-01-03"
    );
    expect(totalPrice).toBe(200); // 2 nights * 100 price per night
  });

  it("should handle unexpected errors and throw them", async () => {
    const error = new Error("Unexpected error");
    Room.findById.mockRejectedValue(error);

    await expect(
      calculateTotalPrice("validRoomId", "2025-01-01", "2025-01-02")
    ).rejects.toThrow("Unexpected error");
  });
});
