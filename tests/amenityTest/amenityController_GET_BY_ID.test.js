const {describe, it, expect, afterEach} = require ('@jest/globals');
const {getAmenity} = require ('../../controllers/amenityController');
const Amenity = require ('../../models/ameniyModel');
const client = require ('../../config/redisConfig');

// Mock dependencies
jest.mock ('../../models/ameniyModel', () => ({
  findById: jest.fn (),
}));
jest.mock ('../../config/redisConfig', () => ({
  get: jest.fn (),
  setEx: jest.fn (),
}));

describe ('getAmenity Controller', () => {
  afterEach (() => {
    jest.clearAllMocks ();
  });

  it ('should return cached data if available', async () => {
    const cachedData = JSON.stringify ({id: '1', name: 'WiFi'});
    client.get.mockResolvedValue (cachedData);

    const req = {params: {id: '1'}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await getAmenity (req, res, next);

    expect (client.get).toHaveBeenCalledWith ('1');
    expect (res.status).toHaveBeenCalledWith (200);
    expect (res.json).toHaveBeenCalledWith (JSON.parse (cachedData));
    expect (Amenity.findById).not.toHaveBeenCalled ();
  });

  it ('should fetch data from MongoDB and cache it when no cached data is found', async () => {
    const mockAmenity = {id: '1', name: 'WiFi'};
    client.get.mockResolvedValue (null);
    Amenity.findById.mockResolvedValue (mockAmenity);

    const req = {params: {id: '1'}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await getAmenity (req, res, next);

    expect (client.get).toHaveBeenCalledWith ('1');
    expect (Amenity.findById).toHaveBeenCalledWith ('1');
    expect (client.setEx).toHaveBeenCalledWith (
      '1',
      3600,
      JSON.stringify (mockAmenity)
    );
    expect (res.status).toHaveBeenCalledWith (200);
    expect (res.json).toHaveBeenCalledWith (mockAmenity);
  });

  it ('should return a 404 error if the amenity is not found', async () => {
    client.get.mockResolvedValue (null);
    Amenity.findById.mockResolvedValue (null);

    const req = {params: {id: '1'}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await getAmenity (req, res, next);

    expect (client.get).toHaveBeenCalledWith ('1');
    expect (Amenity.findById).toHaveBeenCalledWith ('1');
    expect (res.status).toHaveBeenCalledWith (404);
    expect (res.json).toHaveBeenCalledWith ({
      message: 'There are no amenities available',
    });
  });
});
