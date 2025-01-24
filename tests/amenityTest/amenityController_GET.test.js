const {describe, it, expect, afterEach} = require ('@jest/globals');
const {getAmenities} = require ('../../controllers/amenityController');
const Amenity = require ('../../models/ameniyModel');
const client = require ('../../config/redisConfig');

jest.mock ('../../models/ameniyModel', () => {
  const mockQuery = {
    skip: jest.fn ().mockReturnThis (),
    limit: jest.fn ().mockReturnThis (),
    exec: jest.fn (),
  };
  return {
    find: jest.fn ().mockReturnValue (mockQuery),
    countDocuments: jest.fn (),
    skip: jest.fn ().mockReturnThis (),
    limit: jest.fn ().mockReturnThis (),
  };
});

jest.mock ('../../config/redisConfig', () => ({
  get: jest.fn (),
  setEx: jest.fn (),
}));

jest.mock ('../../utils/pagination', () =>
  jest.fn (req => ({
    page: req.query.page || 1,
    limit: req.query.limit || 10,
    skip: ((req.query.page || 1) - 1) * (req.query.limit || 10),
  }))
);

describe ('getAmenities Controller', () => {
  afterEach (() => {
    jest.clearAllMocks ();
  });

  it ('should return cached data if available', async () => {
    const cachedData = JSON.stringify ([
      {id: '1', name: 'WiFi'},
      {id: '2', name: 'Pool'},
    ]);
    client.get.mockResolvedValue (cachedData);

    const req = {query: {page: 1, limit: 10}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await getAmenities (req, res, next);

    expect (client.get).toHaveBeenCalledWith ('amenities:page:1:limit:10');
    expect (res.status).toHaveBeenCalledWith (200);
    expect (res.json).toHaveBeenCalledWith (JSON.parse (cachedData));
    expect (Amenity.find).not.toHaveBeenCalled ();
  });

  it ('should fetch data from MongoDB and cache it when no cached data is found', async () => {
    const mockAmenities = [{id: '1', name: 'WiFi'}, {id: '2', name: 'Pool'}];
    client.get.mockResolvedValue (null);
    Amenity.find ().skip (0).limit (10).exec.mockResolvedValue (mockAmenities);
    Amenity.countDocuments.mockResolvedValue (20);

    const req = {query: {page: 1, limit: 10}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await getAmenities (req, res, next);

    expect (client.get).toHaveBeenCalledWith ('amenities:page:1:limit:10');
    expect (Amenity.find).toHaveBeenCalled ();
    expect (Amenity.find ().skip).toHaveBeenCalledWith (0);
    expect (Amenity.find ().limit).toHaveBeenCalledWith (10);
    expect (Amenity.countDocuments).toHaveBeenCalled ();
    expect (client.setEx).toHaveBeenCalledWith (
      'amenities:page:1:limit:10',
      3600,
      JSON.stringify (mockAmenities)
    );
    expect (res.status).toHaveBeenCalledWith (200);
    expect (res.json).toHaveBeenCalledWith ({
      page: 1,
      limit: 10,
      total: 20,
      totalPage: 2,
      data: mockAmenities,
    });
  });

  it ('should return a 404 error if no amenities are found', async () => {
    client.get.mockResolvedValue (null);
    Amenity.find ().exec.mockResolvedValue ([]);

    const req = {query: {page: 1, limit: 10}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await getAmenities (req, res, next);

    expect (client.get).toHaveBeenCalledWith ('amenities:page:1:limit:10');
    expect (Amenity.find).toHaveBeenCalled ();
    expect (Amenity.find ().skip).toHaveBeenCalledWith (0);
    expect (Amenity.find ().limit).toHaveBeenCalledWith (10);
    expect (Amenity.countDocuments).toHaveBeenCalled ();
    expect (res.status).toHaveBeenCalledWith (404);
    expect (res.json).toHaveBeenCalledWith ({
      message: 'There are no amenities available',
    });
  });
});
