const { describe, it, expect } = require("@jest/globals");
const { deleteReview } = require("../../controllers/reviewController");
const Review = require("../../models/reviewModel");

jest.mock("../../models/reviewModel");

describe("deleteReview Controller", () => {
  it("should return a 404 error if the review is not found", async () => {
    Review.findByIdAndDelete.mockResolvedValue(null);
    const req = {
      params: { id: "123" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await deleteReview(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Cannot Delete The Review" })
    );
  });

  it("should return a 200 status and the deleted review if the review is found and deleted", async () => {
    const mockReview = {
      _id: "123",
      rating: 5,
      description: "Great stay!",
      user: "User 1",
      hotel: "Hotel 1",
    };
    Review.findByIdAndDelete.mockResolvedValue(mockReview);
    const req = {
      params: { id: "123" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await deleteReview(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockReview);
  });

  it("should handle unexpected errors and pass them to the next middleware", async () => {
    const error = new Error("Unexpected error");
    Review.findByIdAndDelete.mockRejectedValue(error);
    const req = {
      params: { id: "123" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await deleteReview(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
