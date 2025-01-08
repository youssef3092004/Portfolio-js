const { describe, it, expect } = require("@jest/globals");
const { deleteRoom } = require("../../controllers/roomController");
const Room = require("../../models/roomModel");

jest.mock("../../models/roomModel");

describe("deleteRoom Controller", () => {
  it("should return a 404 error if the room is not found", async () => {
    Room.findByIdAndDelete.mockResolvedValue(null);
    const req = {
      params: { id: "123" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await deleteRoom(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "No Room with This ID" })
    );
  });

  it("should return a 200 status and a success message if the room is deleted", async () => {
    const mockRoom = {
      _id: "123",
      room_type: "Single",
      room_number: 101,
      price: 100,
      status: "Available",
      hotel: "Hotel 1",
      amenities: ["WiFi"],
    };
    Room.findByIdAndDelete.mockResolvedValue(mockRoom);
    const req = {
      params: { id: "123" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await deleteRoom(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      "the room has been deleted Successfuly"
    );
  });

  it("should handle unexpected errors and pass them to the next middleware", async () => {
    const error = new Error("Unexpected error");
    Room.findByIdAndDelete.mockRejectedValue(error);
    const req = {
      params: { id: "123" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await deleteRoom(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
