const {describe, it, expect, afterEach} = require ('@jest/globals');
const {getBooking} = require ('../../controllers/bookingController');
const Booking = require ('../../models/bookingModel');
const client = require ('../../config/redisConfig');

jest.mock ('../../models/bookingModel', () => {
  return {
    findById: jest.fn ().mockImplementation (() => ({
      populate: jest.fn ().mockReturnThis (),
      exec: jest.fn (),
    })),
  };
});

jest.mock ('../../config/redisConfig', () => ({
  get: jest.fn (),
  setEx: jest.fn (),
}));

describe ('getBooking Controller', () => {
  afterEach (() => {
    jest.clearAllMocks ();
  });
  it ('should return a 404 error if no booking is found by the given ID', async () => {
    Booking.findById.mockImplementation (() => ({
      populate: jest.fn ().mockReturnThis (),
      exec: jest.fn ().mockResolvedValue (null),
    }));
    const req = {
      params: {id: '123'},
    };
    const res = {status: jest.fn ().mockReturnThis (), json: jest.fn ()};
    const next = jest.fn ();
    await getBooking (req, res, next);
    expect (res.status).toHaveBeenCalledWith (404);
    expect (res.json).toHaveBeenCalledWith ({
      message: 'There is no booking by this ID',
    });
  });

  it ('should return a 200 status and the booking if found', async () => {
    const mockBooking = {
      _id: '123',
      check_in: new Date (),
      check_out: new Date (),
      total_price: 100,
      user: {name: 'User 1'},
      hotel: {name: 'Hotel 1'},
      room: {room_number: 101},
      discount: {code: 'DISCOUNT10'},
    };
    Booking.findById.mockImplementation (() => ({
      populate: jest.fn ().mockReturnThis (),
      exec: jest.fn ().mockResolvedValue (mockBooking),
    }));
    const req = {
      params: {id: '123'},
    };
    const res = {status: jest.fn ().mockReturnThis (), json: jest.fn ()};
    const next = jest.fn ();
    await getBooking (req, res, next);
    expect (res.status).toHaveBeenCalledWith (200);
    expect (res.json).toHaveBeenCalledWith ({
      success: true,
      message: 'Booking retrieved successfully.',
      data: mockBooking,
    });
  });

  it ('should return cached data if available', async () => {
    const cachedData = JSON.stringify ({
      id: '1',
      user: 'User1',
      hotel: 'Hotel1',
      room: 'Room1',
      discount: 'Discount1',
    });
    client.get.mockResolvedValue (cachedData);

    const req = {params: {id: '1'}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await getBooking (req, res, next);

    expect (client.get).toHaveBeenCalledWith ('1');
    expect (res.status).toHaveBeenCalledWith (200);
    expect (res.json).toHaveBeenCalledWith (JSON.parse (cachedData));
    expect (Booking.findById).not.toHaveBeenCalled ();
  });
});
