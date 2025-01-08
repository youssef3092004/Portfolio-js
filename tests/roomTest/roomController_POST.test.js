const { describe, it, expect } = require("@jest/globals");
const { createRoom } = require("../../controllers/roomController");
const Room = require("../../models/roomModel");

jest.mock("../../models/roomModel");

describe("createRoom Controller", () => {
  it("should return a 404 error if room_type is missing", async () => {
    const req = {
      body: {
        room_number: 101,
        price: 100,
        status: "Available",
        hotel: "Hotel 1",
        amenities: ["WiFi"],
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    await createRoom(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Room Type is required" })
    );
  });

  it("should return a 404 error if room_number is missing", async () => {
    const req = {
      body: {
        room_type: "Single",
        price: 100,
        status: "Available",
        hotel: "Hotel 1",
        amenities: ["WiFi"],
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    await createRoom(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Room Number is required" })
    );
  });

  it("should return a 404 error if price is missing", async () => {
    const req = {
      body: {
        room_type: "Single",
        room_number: 101,
        status: "Available",
        hotel: "Hotel 1",
        amenities: ["WiFi"],
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    await createRoom(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Price is required" })
    );
  });

  it("should return a 404 error if status is missing", async () => {
    const req = {
      body: {
        room_type: "Single",
        room_number: 101,
        price: 100,
        hotel: "Hotel 1",
        amenities: ["WiFi"],
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    await createRoom(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Status is required" })
    );
  });

  it("should return a 404 error if hotel is missing", async () => {
    const req = {
      body: {
        room_type: "Single",
        room_number: 101,
        price: 100,
        status: "Available",
        amenities: ["WiFi"],
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    await createRoom(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Hotel is required" })
    );
  });

  it("should return a 404 error if amenities are missing", async () => {
    const req = {
      body: {
        room_type: "Single",
        room_number: 101,
        price: 100,
        status: "Available",
        hotel: "Hotel 1",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    await createRoom(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Amenities is required" })
    );
  });

  it("should return a 201 status and the created room if all fields are provided", async () => {
    const mockRoom = {
      _id: "123",
      room_type: "Single",
      room_number: 101,
      price: 100,
      status: "Available",
      hotel: "Hotel 1",
      amenities: ["WiFi"],
    };
    Room.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockRoom),
    }));
    const req = {
      body: mockRoom,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    await createRoom(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockRoom);
  });
  it("should handle unexpected errors and pass them to the next middleware", async () => {
    const error = new Error("Unexpected error");
    Room.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(error),
    }));
    const req = {
      body: {
        room_type: "Single",
        room_number: 101,
        price: 100,
        status: "Available",
        hotel: "Hotel 1",
        amenities: ["WiFi"],
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    await createRoom(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
