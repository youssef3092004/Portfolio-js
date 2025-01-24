const {describe, it, expect, afterEach} = require ('@jest/globals');
const {getUsers} = require ('../../controllers/userController');
const User = require ('../../models/userModel');
const client = require ('../../config/redisConfig'); // Redis client

// Mock dependencies
jest.mock ('../../models/userModel', () => ({
  find: jest.fn ().mockReturnThis (),
  skip: jest.fn ().mockReturnThis (),
  limit: jest.fn ().mockReturnThis (),
  exec: jest.fn ().mockResolvedValue ([]),
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

describe ('getUsers Controller', () => {
  afterEach (() => {
    jest.clearAllMocks ();
  });

  it ('should return cached data if available', async () => {
    const cachedData = JSON.stringify ([
      {id: '1', name: 'John Doe', email: 'john@example.com'},
    ]);
    client.get.mockResolvedValue (cachedData);

    const req = {query: {page: 1, limit: 10}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await getUsers (req, res, next);

    expect (client.get).toHaveBeenCalledWith ('users:page:1:limit:10');
    expect (res.status).toHaveBeenCalledWith (200);
    expect (res.json).toHaveBeenCalledWith (JSON.parse (cachedData));
    expect (User.find).not.toHaveBeenCalled ();
  });
});
