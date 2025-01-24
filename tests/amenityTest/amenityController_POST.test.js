const {describe, it, expect, afterEach} = require ('@jest/globals');
const {createAmenity} = require ('../../controllers/amenityController');
const Amenity = require ('../../models/ameniyModel');
const client = require ('../../config/redisConfig');

jest.mock ('../../models/ameniyModel', () => jest.fn ());
jest.mock ('../../config/redisConfig', () => ({
  setEx: jest.fn (),
}));

describe ('createAmenity Controller', () => {
  afterEach (() => {
    jest.clearAllMocks ();
  });

  it ('should create an amenity successfully', async () => {
    const req = {
      body: {
        name: 'WiFi',
        description: 'High-speed wireless internet',
      },
    };
    const savedAmenity = {
      _id: '1',
      name: 'WiFi',
      description: 'High-speed wireless internet',
    };

    Amenity.prototype.save = jest.fn ().mockResolvedValue (savedAmenity);

    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await createAmenity (req, res, next);

    expect (Amenity.prototype.save).toHaveBeenCalled ();
    expect (client.setEx).toHaveBeenCalledWith (
      '1',
      3600,
      JSON.stringify (savedAmenity)
    );
    expect (res.status).toHaveBeenCalledWith (201);
    expect (res.json).toHaveBeenCalledWith (savedAmenity);
  });

  it ('should return a 400 error if required fields are missing', async () => {
    const req = {
      body: {
        name: '',
        description: 'High-speed wireless internet',
      },
    };

    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await createAmenity (req, res, next);

    expect (res.status).toHaveBeenCalledWith (400);
    expect (next).toHaveBeenCalledWith (expect.any (Error));
    expect (next.mock.calls[0][0].message).toBe ('Name is required');
  });

  it ('should call next with an error if an exception occurs', async () => {
    const req = {
      body: {
        name: 'WiFi',
        description: 'High-speed wireless internet',
      },
    };

    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    Amenity.prototype.save = jest
      .fn ()
      .mockRejectedValue (new Error ('Database error'));

    await createAmenity (req, res, next);

    expect (next).toHaveBeenCalledWith (expect.any (Error));
    expect (res.status).not.toHaveBeenCalled ();
  });
});
