const {describe, it, expect, afterEach} = require ('@jest/globals');
const {deleteAmenity} = require ('../../controllers/amenityController');
const Amenity = require ('../../models/ameniyModel');
const client = require ('../../config/redisConfig');

// Mock dependencies
jest.mock ('../../models/ameniyModel', () => ({
  findById: jest.fn (),
  findByIdAndDelete: jest.fn (),
}));
jest.mock ('../../config/redisConfig', () => ({
  del: jest.fn (),
}));

describe ('deleteAmenity Controller', () => {
  afterEach (() => {
    jest.clearAllMocks ();
  });

  it ('should delete an amenity successfully', async () => {
    const req = {params: {id: '1'}};
    const amenity = {
      _id: '1',
      name: 'WiFi',
      description: 'High-speed wireless internet',
    };

    Amenity.findById.mockResolvedValue (amenity);
    Amenity.findByIdAndDelete.mockResolvedValue (amenity);

    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await deleteAmenity (req, res, next);

    expect (Amenity.findById).toHaveBeenCalledWith ('1');
    expect (Amenity.findByIdAndDelete).toHaveBeenCalledWith ('1');
    expect (client.del).toHaveBeenCalledWith ('1');
    expect (res.status).toHaveBeenCalledWith (200);
    expect (res.json).toHaveBeenCalledWith ({message: 'Amenity removed'});
  });

  it ('should return a 404 error if the amenity is not found', async () => {
    Amenity.findById.mockResolvedValue (null);

    const req = {params: {id: '1'}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await deleteAmenity (req, res, next);

    expect (Amenity.findById).toHaveBeenCalledWith ('1');
    expect (res.status).toHaveBeenCalledWith (404);
    expect (res.json).toHaveBeenCalledWith ({
      message: 'There is no amenity by this ID',
    });
  });

  it ('should call next with an error if an exception occurs', async () => {
    Amenity.findById.mockRejectedValue (new Error ('Database error'));

    const req = {params: {id: '1'}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await deleteAmenity (req, res, next);

    expect (Amenity.findById).toHaveBeenCalledWith ('1');
    expect (next).toHaveBeenCalledWith (expect.any (Error));
    expect (res.status).not.toHaveBeenCalled ();
  });
});
