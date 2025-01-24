const {describe, it, expect, afterEach} = require ('@jest/globals');
const {getRoom} = require ('../../controllers/roomController');
const Room = require ('../../models/roomModel');
const client = require ('../../config/redisConfig');

jest.mock ('../../models/roomModel', () => ({
  findById: jest.fn ().mockReturnThis (),
  populate: jest.fn ().mockReturnThis ().mockImplementation (function () {
    return this;
  }),
  exec: jest.fn ().mockResolvedValue ({
    id: '1',
    hotel: 'Hotel1',
    amenities: ['WiFi', 'Pool'],
  }),
}));

jest.mock ('../../config/redisConfig', () => ({
  get: jest.fn (),
  setEx: jest.fn (),
}));

describe ('getRoom Controller', () => {
  afterEach (() => {
    jest.clearAllMocks ();
  });

  it ('should return cached data if available', async () => {
    const cachedData = JSON.stringify ({
      id: '1',
      hotel: 'Hotel1',
      amenities: ['WiFi', 'Pool'],
    });
    client.get.mockResolvedValue (cachedData);

    const req = {params: {id: '1'}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await getRoom (req, res, next);

    expect (client.get).toHaveBeenCalledWith ('1');
    expect (res.status).toHaveBeenCalledWith (200);
    expect (res.json).toHaveBeenCalledWith (JSON.parse (cachedData));
    expect (Room.findById).not.toHaveBeenCalled ();
  });
});
