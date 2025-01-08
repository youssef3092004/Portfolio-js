const { describe, it, expect } = require("@jest/globals");
const { createReview } = require("../../controllers/reviewController");
const Review = require("../../models/reviewModel");

jest.mock("../../models/reviewModel");

describe("createReview Controller", () => {
  it("should return a 404 error if rating is missing", async () => {
    const req = {
      body: { description: "Great stay!", user: "User 1", hotel: "Hotel 1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    await createReview(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Rating is required" })
    );
  });

  it("should return a 404 error if description is missing", async () => {
    const req = {
      body: { rating: 5, user: "User 1", hotel: "Hotel 1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    await createReview(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Description is required" })
    );
  });

  it("should return a 404 error if user is missing", async () => {
    const req = {
      body: { rating: 5, description: "Great stay!", hotel: "Hotel 1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    await createReview(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "User is required" })
    );
  });

  it("should return a 404 error if hotel is missing", async () => {
    const req = {
      body: { rating: 5, description: "Great stay!", user: "User 1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    await createReview(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Hotel is required" })
    );
  });

  it("should return a 201 status and the created review if all fields are provided", async () => {
    const mockReview = {
      _id: "123",
      rating: 5,
      description: "Great stay!",
      user: "User 1",
      hotel: "Hotel 1",
    };
    Review.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockReview),
    }));
    const req = {
      body: mockReview,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    await createReview(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockReview);
  });

  it("should handle unexpected errors and pass them to the next middleware", async () => {
    const error = new Error("Unexpected error");
    Review.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(error),
    }));
    const req = {
      body: {
        rating: 5,
        description: "Great stay!",
        user: "User 1",
        hotel: "Hotel 1",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    await createReview(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
