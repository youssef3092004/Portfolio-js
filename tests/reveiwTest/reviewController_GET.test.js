const {describe, it, expect, afterEach} = require ('@jest/globals');
const {getReviews} = require ('../../controllers/reviewController');
const Review = require ('../../models/reviewModel');
const client = require ('../../config/redisConfig');

jest.mock ('../../models/reviewModel', () => ({
  find: jest.fn ().mockReturnThis (),
  populate: jest.fn ().mockReturnThis (),
  skip: jest.fn ().mockReturnThis (),
  limit: jest.fn ().mockReturnThis (),
  exec: jest.fn (),
  countDocuments: jest.fn (),
}));

jest.mock ('../../config/redisConfig', () => ({
  get: jest.fn (),
  setEx: jest.fn (),
}));

// Mock pagination function
jest.mock ('../../utils/pagination', () =>
  jest.fn (req => ({
    page: req.query.page || 1,
    limit: req.query.limit || 10,
    skip: ((req.query.page || 1) - 1) * (req.query.limit || 10),
  }))
);

describe ('getReviews Controller', () => {
  afterEach (() => {
    jest.clearAllMocks ();
  });

  it ('should return cached data if available', async () => {
    const cachedData = JSON.stringify ([
      {id: '1', user: 'User1', hotel: 'Hotel1', review: 'Great stay!'},
    ]);
    client.get.mockResolvedValue (cachedData);

    const req = {query: {page: 1, limit: 10}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await getReviews (req, res, next);

    expect (client.get).toHaveBeenCalledWith ('reviews:page:1:limit:10');
    expect (res.status).toHaveBeenCalledWith (200);
    expect (res.json).toHaveBeenCalledWith (JSON.parse (cachedData));
    expect (Review.find).not.toHaveBeenCalled ();
  });

  it ('should fetch data from MongoDB and cache it when no cached data is found', async () => {
    const mockReviews = [
      {id: '1', user: 'User1', hotel: 'Hotel1', review: 'Great stay!'},
      {id: '2', user: 'User2', hotel: 'Hotel2', review: 'Not bad!'},
    ];
    client.get.mockResolvedValue (null);
    Review.exec.mockResolvedValue (mockReviews);
    Review.countDocuments.mockResolvedValue (20);

    const req = {query: {page: 1, limit: 10}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await getReviews (req, res, next);

    expect (client.get).toHaveBeenCalledWith ('reviews:page:1:limit:10');
    expect (Review.find).toHaveBeenCalled ();
    expect (Review.populate).toHaveBeenCalledWith ('user');
    expect (Review.populate).toHaveBeenCalledWith ('hotel');
    expect (Review.skip).toHaveBeenCalledWith (0);
    expect (Review.limit).toHaveBeenCalledWith (10);
    expect (Review.exec).toHaveBeenCalled ();
    expect (client.setEx).toHaveBeenCalledWith (
      'reviews:page:1:limit:10',
      3600,
      JSON.stringify (mockReviews)
    );
    expect (res.status).toHaveBeenCalledWith (200);
    expect (res.json).toHaveBeenCalledWith ({
      page: 1,
      limit: 10,
      total: 20,
      totalPage: 2,
      data: mockReviews,
    });
  });

  it ('should return a 404 error if no reviews are found', async () => {
    client.get.mockResolvedValue (null);
    Review.exec.mockResolvedValue ([]);

    const req = {query: {page: 1, limit: 10}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await getReviews (req, res, next);

    expect (client.get).toHaveBeenCalledWith ('reviews:page:1:limit:10');
    expect (Review.find).toHaveBeenCalled ();
    expect (Review.populate).toHaveBeenCalledWith ('user');
    expect (Review.populate).toHaveBeenCalledWith ('hotel');
    expect (Review.skip).toHaveBeenCalledWith (0);
    expect (Review.limit).toHaveBeenCalledWith (10);
    expect (Review.exec).toHaveBeenCalled ();
    expect (res.status).toHaveBeenCalledWith (404);
    expect (res.json).toHaveBeenCalledWith ({
      message: 'There are no reviews available',
    });
  });

  it ('should call next with an error if an exception occurs', async () => {
    client.get.mockResolvedValue (null);
    Review.exec.mockRejectedValue (new Error ('Database error'));

    const req = {query: {page: 1, limit: 10}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await getReviews (req, res, next);

    expect (client.get).toHaveBeenCalledWith ('reviews:page:1:limit:10');
    expect (Review.find).toHaveBeenCalled ();
    expect (Review.populate).toHaveBeenCalledWith ('user');
    expect (Review.populate).toHaveBeenCalledWith ('hotel');
    expect (Review.skip).toHaveBeenCalledWith (0);
    expect (Review.limit).toHaveBeenCalledWith (10);
    expect (Review.exec).toHaveBeenCalled ();
    expect (next).toHaveBeenCalledWith (expect.any (Error));
    expect (res.status).not.toHaveBeenCalled ();
  });
});
