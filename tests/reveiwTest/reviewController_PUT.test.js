const { describe, it, expect } = require("@jest/globals");
const { updateReview } = require("../../controllers/reviewController");
const Review = require("../../models/reviewModel");

jest.mock("../../models/reviewModel");

describe("updateReview Controller", () => {
  it("should return a 400 error if no fields are provided for update", async () => {
    const req = {
      body: {},
      params: { id: "123" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    await updateReview(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "No fields provided for update" })
    );
  });

  it("should return a 404 error if the review is not found", async () => {
    const req = {
      body: { rating: 5 },
      params: { id: "123" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    Review.findByIdAndUpdate.mockResolvedValue(null);
    await updateReview(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Cannot Update The Review" })
    );
  });

  it("should return a 200 status and the updated review if the update is successful", async () => {
    const mockReview = {
      _id: "123",
      rating: 5,
      description: "Great stay!",
      user: "User 1",
      hotel: "Hotel 1",
    };
    const req = {
      body: { rating: 4 },
      params: { id: "123" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    Review.findByIdAndUpdate.mockResolvedValue(mockReview);
    await updateReview(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockReview);
  });

  it("should handle unexpected errors and pass them to the next middleware", async () => {
    const error = new Error("Unexpected error");
    const req = {
      body: { rating: 5 },
      params: { id: "123" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    Review.findByIdAndUpdate.mockRejectedValue(error);
    await updateReview(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
