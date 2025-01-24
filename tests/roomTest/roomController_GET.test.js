const { describe, it, expect, afterEach } = require("@jest/globals");
const { getRooms } = require("../../controllers/roomController");
const Room = require("../../models/roomModel");
const client = require("../../config/redisConfig"); // Redis client

// Mock dependencies
jest.mock("../../models/roomModel", () => ({
  find: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  exec: jest.fn(),
  countDocuments: jest.fn(),
}));

jest.mock("../../config/redisConfig", () => ({
  get: jest.fn(),
  setEx: jest.fn(),
}));

// Mock pagination function
jest.mock("../../utils/pagination", () => jest.fn((req) => ({
  page: req.query.page || 1,
  limit: req.query.limit || 10,
  skip: ((req.query.page || 1) - 1) * (req.query.limit || 10),
})));

describe("getRooms Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return cached data if available", async () => {
    const cachedData = JSON.stringify([
      { id: "1", hotel: "Hotel1", amenities: ["WiFi", "Pool"] },
    ]);
    client.get.mockResolvedValue(cachedData);

    const req = { query: { page: 1, limit: 10 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getRooms(req, res, next);

    expect(client.get).toHaveBeenCalledWith("rooms:page:1:limit:10");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(JSON.parse(cachedData));
    expect(Room.find).not.toHaveBeenCalled();
  });

  it("should fetch data from MongoDB and cache it when no cached data is found", async () => {
    const mockRooms = [
      { id: "1", hotel: "Hotel1", amenities: ["WiFi", "Pool"] },
      { id: "2", hotel: "Hotel2", amenities: ["Gym", "Spa"] },
    ];
    client.get.mockResolvedValue(null);
    Room.exec.mockResolvedValue(mockRooms);
    Room.countDocuments.mockResolvedValue(20);

    const req = { query: { page: 1, limit: 10 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getRooms(req, res, next);

    expect(client.get).toHaveBeenCalledWith("rooms:page:1:limit:10");
    expect(Room.find).toHaveBeenCalled();
    expect(Room.populate).toHaveBeenCalledWith("hotel amenities");
    expect(Room.skip).toHaveBeenCalledWith(0);
    expect(Room.limit).toHaveBeenCalledWith(10);
    expect(Room.exec).toHaveBeenCalled();
    expect(client.setEx).toHaveBeenCalledWith(
      "rooms:page:1:limit:10",
      3600,
      JSON.stringify(mockRooms)
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      total: 20,
      totalPage: 2,
      data: mockRooms,
    });
  });

  it("should return a 404 error if no rooms are found", async () => {
    client.get.mockResolvedValue(null);
    Room.exec.mockResolvedValue([]);

    const req = { query: { page: 1, limit: 10 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getRooms(req, res, next);

    expect(client.get).toHaveBeenCalledWith("rooms:page:1:limit:10");
    expect(Room.find).toHaveBeenCalled();
    expect(Room.populate).toHaveBeenCalledWith("hotel amenities");
    expect(Room.skip).toHaveBeenCalledWith(0);
    expect(Room.limit).toHaveBeenCalledWith(10);
    expect(Room.exec).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith({ status: 404, message: "There are no rooms available" });
  });

  it("should call next with an error if an exception occurs", async () => {
    client.get.mockResolvedValue(null);
    Room.exec.mockRejectedValue(new Error("Database error"));

    const req = { query: { page: 1, limit: 10 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getRooms(req, res, next);

    expect(client.get).toHaveBeenCalledWith("rooms:page:1:limit:10");
    expect(Room.find).toHaveBeenCalled();
    expect(Room.populate).toHaveBeenCalledWith("hotel amenities");
    expect(Room.skip).toHaveBeenCalledWith(0);
    expect(Room.limit).toHaveBeenCalledWith(10);
    expect(Room.exec).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(res.status).not.toHaveBeenCalled();
  });
});
