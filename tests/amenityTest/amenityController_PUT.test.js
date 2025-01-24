const {describe, it, expect, afterEach} = require ('@jest/globals');
const {updateAmenity} = require ('../../controllers/amenityController');
const Amenity = require ('../../models/ameniyModel');
const client = require ('../../config/redisConfig');

// Mock dependencies
jest.mock ('../../models/ameniyModel', () => ({
  findByIdAndUpdate: jest.fn (),
}));
jest.mock ('../../config/redisConfig', () => ({
  setEx: jest.fn (),
}));

describe ('updateAmenity Controller', () => {
  afterEach (() => {
    jest.clearAllMocks ();
  });

  it ('should update an amenity successfully', async () => {
    const req = {
      params: {id: '1'},
      body: {
        name: 'Updated WiFi',
        description: 'Updated high-speed wireless internet',
      },
    };
    const updatedAmenity = {
      _id: '1',
      name: 'Updated WiFi',
      description: 'Updated high-speed wireless internet',
    };

    Amenity.findByIdAndUpdate.mockResolvedValue (updatedAmenity);

    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await updateAmenity (req, res, next);

    expect (Amenity.findByIdAndUpdate).toHaveBeenCalledWith (
      '1',
      {
        $set: {
          name: 'Updated WiFi',
          description: 'Updated high-speed wireless internet',
        },
      },
      {new: true}
    );
    expect (client.setEx).toHaveBeenCalledWith (
      '1',
      3600,
      JSON.stringify (updatedAmenity)
    );
    expect (res.status).toHaveBeenCalledWith (200);
    expect (res.json).toHaveBeenCalledWith (updatedAmenity);
  });

  it ('should return a 400 error if name is missing', async () => {
    const req = {
      params: {id: '1'},
      body: {
        description: 'Updated high-speed wireless internet',
      },
    };

    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await updateAmenity (req, res, next);

    expect (res.status).toHaveBeenCalledWith (400);
    expect (res.json).toHaveBeenCalledWith ({message: 'Name is required'});
  });

  it ('should return a 400 error if description is missing', async () => {
    const req = {
      params: {id: '1'},
      body: {
        name: 'Updated WiFi',
      },
    };

    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await updateAmenity (req, res, next);

    expect (res.status).toHaveBeenCalledWith (400);
    expect (res.json).toHaveBeenCalledWith ({
      message: 'Description is required',
    });
  });

  it ('should call next with an error if an exception occurs', async () => {
    const req = {
      params: {id: '1'},
      body: {
        name: 'Updated WiFi',
        description: 'Updated high-speed wireless internet',
      },
    };

    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    Amenity.findByIdAndUpdate.mockRejectedValue (new Error ('Database error'));

    await updateAmenity (req, res, next);

    expect (next).toHaveBeenCalledWith (expect.any (Error));
    expect (res.status).not.toHaveBeenCalled ();
  });
});
