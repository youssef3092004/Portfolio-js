const { describe, it, expect } = require('@jest/globals');
const { getReview } = require('../../controllers/reviewController');
const Review = require('../../models/reviewModel');

jest.mock('../../models/reviewModel');

describe('getReview Controller', () => {
  it('should return a 404 error if no review is found by the given ID', async () => {
    Review.findById.mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    }));
    const req = {
      params: { id: '123' },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await getReview(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'There is no review by this ID' });
  });

  it('should return a 200 status and the review if found', async () => {
    const mockReview = {
      _id: '123',
      user: { name: 'User 1' },
      hotel: { name: 'Hotel 1' },
      rating: 5,
      comment: 'Great stay!',
    };
    Review.findById.mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockReview),
    }));
    const req = {
      params: { id: '123' },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await getReview(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockReview);
  });

  it('should handle unexpected errors and pass them to the next middleware', async () => {
    const error = new Error('Unexpected error');
    Review.findById.mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockRejectedValue(error),
    }));
    const req = {
      params: { id: '123' },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await getReview(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
