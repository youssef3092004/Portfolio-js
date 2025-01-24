const {describe, it, expect, afterEach} = require ('@jest/globals');
const {getLocation} = require ('../../controllers/locationController');
const Location = require ('../../models/locationModel');
const client = require ('../../config/redisConfig');

jest.mock ('../../models/locationModel', () => ({
  findById: jest.fn (),
}));

jest.mock ('../../config/redisConfig', () => ({
  get: jest.fn (),
  setEx: jest.fn (),
}));

describe ('getLocation Controller', () => {
  afterEach (() => {
    jest.clearAllMocks ();
  });

  it ('should return a location if found', async () => {
    const mockLocation = {id: '1', country: 'USA', city: 'New York'};
    Location.findById.mockResolvedValue (mockLocation);

    const req = {params: {id: '1'}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await getLocation (req, res, next);

    expect (Location.findById).toHaveBeenCalledWith ('1');
    expect (res.status).toHaveBeenCalledWith (200);
    expect (res.json).toHaveBeenCalledWith (mockLocation);
  });

  it ('should return cached data if available', async () => {
    const cachedData = JSON.stringify ({
      id: '1',
      country: 'USA',
      city: 'New York',
    });
    client.get.mockResolvedValue (cachedData);

    const req = {params: {id: '1'}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await getLocation (req, res, next);

    expect (client.get).toHaveBeenCalledWith ('1');
    expect (res.status).toHaveBeenCalledWith (200);
    expect (res.json).toHaveBeenCalledWith (JSON.parse (cachedData));
    expect (Location.findById).not.toHaveBeenCalled ();
  });
});
