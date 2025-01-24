const {describe, it, expect, afterEach} = require ('@jest/globals');
const {getReview} = require ('../../controllers/reviewController');
const Review = require ('../../models/reviewModel');
const client = require ('../../config/redisConfig');

jest.mock ('../../models/reviewModel', () => ({
  findById: jest.fn ().mockReturnThis (),
  populate: jest.fn ().mockReturnThis (),
  exec: jest.fn (),
}));

jest.mock ('../../config/redisConfig', () => ({
  get: jest.fn (),
  setEx: jest.fn (),
}));

describe ('getReview Controller', () => {
  afterEach (() => {
    jest.clearAllMocks ();
  });

  it ('should return a review if found', async () => {
    const mockReview = {
      id: '1',
      user: 'User1',
      hotel: 'Hotel1',
      review: 'Great stay!',
    };
    Review.exec.mockResolvedValue (mockReview);

    client.get.mockResolvedValue (null);
    const req = {params: {id: '1'}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await getReview (req, res, next);

    expect (Review.findById).toHaveBeenCalledWith ('1');
    expect (Review.populate).toHaveBeenCalledWith ('user');
    expect (Review.populate).toHaveBeenCalledWith ('hotel');
    expect (Review.exec).toHaveBeenCalled ();
    expect (res.status).toHaveBeenCalledWith (200);
    expect (res.json).toHaveBeenCalledWith (mockReview);
  });

  it ('should return cached data if available', async () => {
    const cachedData = JSON.stringify ({
      id: '1',
      user: 'User1',
      hotel: 'Hotel1',
      review: 'Great stay!',
    });
    client.get.mockResolvedValue (cachedData);

    const req = {params: {id: '1'}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await getReview (req, res, next);

    expect (client.get).toHaveBeenCalledWith ('1');
    expect (res.status).toHaveBeenCalledWith (200);
    expect (res.json).toHaveBeenCalledWith (JSON.parse (cachedData));
    expect (Review.findById).not.toHaveBeenCalled ();
  });

  it ('should return a 404 error if no review is found', async () => {
    client.get.mockResolvedValue (null);
    Review.findById.mockReturnThis ();
    Review.populate.mockReturnThis ();
    Review.exec.mockResolvedValue (null);

    const req = {params: {id: '1'}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await getReview (req, res, next);

    expect (Review.findById).toHaveBeenCalledWith ('1');
    expect (Review.populate).toHaveBeenCalledWith ('user');
    expect (Review.populate).toHaveBeenCalledWith ('hotel');
    expect (Review.exec).toHaveBeenCalled ();
    expect (res.status).toHaveBeenCalledWith (404);
    expect (res.json).toHaveBeenCalledWith ({
      message: 'There is no review by this ID',
    });
  });

  it ('should call next with an error if an exception occurs', async () => {
    client.get.mockResolvedValue (null);
    Review.findById.mockReturnThis ();
    Review.populate.mockReturnThis ();
    Review.exec.mockRejectedValue (new Error ('Database error'));

    const req = {params: {id: '1'}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await getReview (req, res, next);

    expect (Review.findById).toHaveBeenCalledWith ('1');
    expect (Review.populate).toHaveBeenCalledWith ('user');
    expect (Review.populate).toHaveBeenCalledWith ('hotel');
    expect (Review.exec).toHaveBeenCalled ();
    expect (next).toHaveBeenCalledWith (expect.any (Error));
    expect (res.status).not.toHaveBeenCalled ();
  });
});
