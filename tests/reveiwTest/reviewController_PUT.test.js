const {describe, it, expect, afterEach} = require ('@jest/globals');
const {updateReview} = require ('../../controllers/reviewController');
const Review = require ('../../models/reviewModel');
const client = require ('../../config/redisConfig');

jest.mock ('../../models/reviewModel', () => ({
  findByIdAndUpdate: jest.fn (),
  save: jest.fn (),
}));

jest.mock ('../../config/redisConfig', () => ({
  setEx: jest.fn (),
}));

describe ('updateReview Controller', () => {
  afterEach (() => {
    jest.clearAllMocks ();
  });

  it ('should return a 200 status and the updated review if the update is successful', async () => {
    const mockReview = {
      _id: '1',
      rating: 5,
      description: 'Great stay!',
      user: 'User1',
      hotel: 'Hotel1',
    };
    Review.findByIdAndUpdate.mockResolvedValue (mockReview);
    mockReview.save = jest.fn ().mockResolvedValue (mockReview);

    const req = {
      params: {id: '1'},
      body: {rating: 5, description: 'Great stay!'},
    };
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await updateReview (req, res, next);

    expect (Review.findByIdAndUpdate).toHaveBeenCalledWith (
      '1',
      {$set: {rating: 5, description: 'Great stay!'}},
      {new: true}
    );
    expect (mockReview.save).toHaveBeenCalled ();
    expect (client.setEx).toHaveBeenCalledWith (
      mockReview._id,
      3600,
      JSON.stringify (mockReview)
    );
    expect (res.status).toHaveBeenCalledWith (200);
    expect (res.json).toHaveBeenCalledWith (mockReview);
  });

  it ('should return a 400 error if no fields are provided for update', async () => {
    const req = {params: {id: '1'}, body: {}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await updateReview (req, res, next);

    expect (res.status).toHaveBeenCalledWith (400);
    expect (next).toHaveBeenCalledWith (expect.any (Error));
  });

  it ('should return a 404 error if the review is not found', async () => {
    Review.findByIdAndUpdate.mockResolvedValue (null);

    const req = {
      params: {id: '1'},
      body: {rating: 5, description: 'Great stay!'},
    };
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await updateReview (req, res, next);

    expect (Review.findByIdAndUpdate).toHaveBeenCalledWith (
      '1',
      {$set: {rating: 5, description: 'Great stay!'}},
      {new: true}
    );
    expect (res.status).toHaveBeenCalledWith (404);
    expect (next).toHaveBeenCalledWith (expect.any (Error));
  });

  it ('should call next with an error if an exception occurs', async () => {
    Review.findByIdAndUpdate.mockRejectedValue (new Error ('Database error'));

    const req = {
      params: {id: '1'},
      body: {rating: 5, description: 'Great stay!'},
    };
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await updateReview (req, res, next);

    expect (Review.findByIdAndUpdate).toHaveBeenCalledWith (
      '1',
      {$set: {rating: 5, description: 'Great stay!'}},
      {new: true}
    );
    expect (next).toHaveBeenCalledWith (expect.any (Error));
    expect (res.status).not.toHaveBeenCalled ();
  });
});
