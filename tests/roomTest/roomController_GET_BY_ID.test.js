const { describe, it, expect } = require("@jest/globals");
const { getRoom } = require("../../controllers/roomController");
const Room = require("../../models/roomModel");

jest.mock("../../models/roomModel");

describe("getRoom Controller", () => {
  it("should return a 404 error if no room is found by the given ID", async () => {
    Room.findById.mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    }));
    const req = {
      params: { id: "123" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await getRoom(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        message: "There are no room available",
      })
    );
  });

  it("should return a 200 status and the room if found", async () => {
    const mockRoom = [
      {
        _id: "123",
        room_type: "Single",
        room_number: 101,
        price: 100,
        status: "Available",
        hotel: 150,
        amenities: [121, 122],
      },
    ];
    Room.findById.mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockRoom),
    }));
    const req = {
      params: { id: "123" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await getRoom(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockRoom);
  });

  it("should handle unexpected errors and pass them to the next middleware", async () => {
    const error = new Error("Unexpected error");
    Room.findById.mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockRejectedValue(error),
    }));
    const req = {
      params: { id: "123" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await getRoom(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
