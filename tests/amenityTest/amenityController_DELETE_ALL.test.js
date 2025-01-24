const {describe, it, expect, afterEach} = require ('@jest/globals');
const {deleteAllAmenitys} = require ('../../controllers/amenityController');
const Amenity = require ('../../models/ameniyModel');
const client = require ('../../config/redisConfig');

// Mock dependencies
jest.mock ('../../models/ameniyModel', () => ({
  deleteMany: jest.fn (),
}));
jest.mock ('../../config/redisConfig', () => ({
  keys: jest.fn (),
  del: jest.fn (),
}));

describe ('deleteAllAmenitys Controller', () => {
  afterEach (() => {
    jest.clearAllMocks ();
  });

  it ('should delete all amenities successfully', async () => {
    const result = {deletedCount: 5};
    Amenity.deleteMany.mockResolvedValue (result);
    client.keys.mockResolvedValue (['amenities:1', 'amenities:2']);

    const req = {};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await deleteAllAmenitys (req, res, next);

    expect (Amenity.deleteMany).toHaveBeenCalled ();
    expect (client.keys).toHaveBeenCalledWith ('amenities:*');
    expect (client.del).toHaveBeenCalledWith ('amenities:1');
    expect (client.del).toHaveBeenCalledWith ('amenities:2');
    expect (res.status).toHaveBeenCalledWith (200);
    expect (res.json).toHaveBeenCalledWith ({
      message: '5 amenities removed successfully',
    });
  });

  it ('should return a 404 error if no amenities are found to delete', async () => {
    const result = {deletedCount: 0};
    Amenity.deleteMany.mockResolvedValue (result);

    const req = {};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await deleteAllAmenitys (req, res, next);

    expect (Amenity.deleteMany).toHaveBeenCalled ();
    expect (res.status).toHaveBeenCalledWith (404);
    expect (res.json).toHaveBeenCalledWith ({
      message: 'There are no amenities to delete',
    });
  });
});
