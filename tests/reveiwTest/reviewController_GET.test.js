const { describe, it, expect } = require("@jest/globals");
const { getReviews } = require("../../controllers/reviewController");
const Review = require("../../models/reviewModel");

jest.mock("../../models/reviewModel");

describe("getReviews Controller", () => {
  it("should return a 404 error if no reviews are found", async () => {
    Review.find.mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    }));
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await getReviews(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "There are no reviews available",
    });
  });

  it("should return a 200 status and the reviews if found", async () => {
    const mockReviews = [
      {
        _id: "123",
        user: { name: "User 1" },
        hotel: { name: "Hotel 1" },
        rating: 5,
        comment: "Great stay!",
      },
    ];
    Review.find.mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockReviews),
    }));

    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await getReviews(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockReviews);
  });

  it("should handle unexpected errors and pass them to the next middleware", async () => {
    const error = new Error("Unexpected error");
    Review.find.mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockRejectedValue(error),
    }));
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await getReviews(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
