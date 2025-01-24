const { describe, it, expect, afterEach } = require("@jest/globals");
const { getBookings } = require("../../controllers/bookingController");
const Booking = require("../../models/bookingModel");
const client = require("../../config/redisConfig");

jest.mock("../../models/bookingModel", () => ({
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

jest.mock("../../utils/pagination", () => jest.fn((req) => ({
  page: req.query.page || 1,
  limit: req.query.limit || 10,
  skip: ((req.query.page || 1) - 1) * (req.query.limit || 10),
})));

describe("getBookings Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return cached data if available", async () => {
    const cachedData = JSON.stringify([
      { id: "1", user: "User1", hotel: "Hotel1", room: "Room1", discount: "Discount1" },
    ]);
    client.get.mockResolvedValue(cachedData);

    const req = { query: { page: 1, limit: 10 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getBookings(req, res, next);

    expect(client.get).toHaveBeenCalledWith("bookings:page:1:limit:10");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(JSON.parse(cachedData));
    expect(Booking.find).not.toHaveBeenCalled();
  });

  it("should fetch data from MongoDB and cache it when no cached data is found", async () => {
    const mockBookings = [
      { id: "1", user: "User1", hotel: "Hotel1", room: "Room1", discount: "Discount1" },
      { id: "2", user: "User2", hotel: "Hotel2", room: "Room2", discount: "Discount2" },
    ];
    client.get.mockResolvedValue(null);
    Booking.exec.mockResolvedValue(mockBookings);
    Booking.countDocuments.mockResolvedValue(20);

    const req = { query: { page: 1, limit: 10 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getBookings(req, res, next);

    expect(client.get).toHaveBeenCalledWith("bookings:page:1:limit:10");
    expect(Booking.find).toHaveBeenCalled();
    expect(Booking.populate).toHaveBeenCalledWith("user");
    expect(Booking.populate).toHaveBeenCalledWith("hotel");
    expect(Booking.populate).toHaveBeenCalledWith("room");
    expect(Booking.populate).toHaveBeenCalledWith("discount");
    expect(Booking.skip).toHaveBeenCalledWith(0);
    expect(Booking.limit).toHaveBeenCalledWith(10);
    expect(Booking.exec).toHaveBeenCalled();
    expect(client.setEx).toHaveBeenCalledWith(
      "bookings:page:1:limit:10",
      3600,
      JSON.stringify(mockBookings)
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      total: 20,
      totalPage: 2,
      success: true,
      message: "Booking retrieved successfully.",
      data: mockBookings,
    });
  });

  it("should return a 404 error if no bookings are found", async () => {
    client.get.mockResolvedValue(null);
    Booking.exec.mockResolvedValue([]);

    const req = { query: { page: 1, limit: 10 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getBookings(req, res, next);

    expect(client.get).toHaveBeenCalledWith("bookings:page:1:limit:10");
    expect(Booking.find).toHaveBeenCalled();
    expect(Booking.populate).toHaveBeenCalledWith("user");
    expect(Booking.populate).toHaveBeenCalledWith("hotel");
    expect(Booking.populate).toHaveBeenCalledWith("room");
    expect(Booking.populate).toHaveBeenCalledWith("discount");
    expect(Booking.skip).toHaveBeenCalledWith(0);
    expect(Booking.limit).toHaveBeenCalledWith(10);
    expect(Booking.exec).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "There is no bookings by this ID" });
  });

  it("should call next with an error if an exception occurs", async () => {
    client.get.mockResolvedValue(null);
    Booking.exec.mockRejectedValue(new Error("Database error"));

    const req = { query: { page: 1, limit: 10 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getBookings(req, res, next);

    expect(client.get).toHaveBeenCalledWith("bookings:page:1:limit:10");
    expect(Booking.find).toHaveBeenCalled();
    expect(Booking.populate).toHaveBeenCalledWith("user");
    expect(Booking.populate).toHaveBeenCalledWith("hotel");
    expect(Booking.populate).toHaveBeenCalledWith("room");
    expect(Booking.populate).toHaveBeenCalledWith("discount");
    expect(Booking.skip).toHaveBeenCalledWith(0);
    expect(Booking.limit).toHaveBeenCalledWith(10);
    expect(Booking.exec).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(res.status).not.toHaveBeenCalled();
  });
});
