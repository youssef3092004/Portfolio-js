const { describe, it, expect } = require('@jest/globals');
const { getBookings } = require('../../controllers/bookingController');
const Booking = require('../../models/bookingModel');

jest.mock('../../models/bookingModel');

describe('getBookings Controller', () => {
  it('should return a 404 error if no bookings are found', async () => {
    // Mock `find` to return an empty array, simulating no bookings found
    Booking.find.mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    }));

    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await getBookings(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'There is no bookings by this ID' });
  });

  it('should return a 200 status and the bookings if found', async () => {
    const mockBookings = [
      {
        _id: '123',
        check_in: new Date(),
        check_out: new Date(),
        total_price: 100,
        user: { name: 'User 1' },
        hotel: { name: 'Hotel 1' },
        room: { room_number: 101 },
        discount: { code: 'DISCOUNT10' },
      },
    ];

    // Mock `find` to return an array of bookings
    Booking.find.mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockBookings),
    }));

    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await getBookings(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Booking retrieved successfully.',
      data: mockBookings,
    });
  });

  it('should handle unexpected errors and pass them to the next middleware', async () => {
    const error = new Error('Unexpected error');

    // Mock `find` to throw an error
    Booking.find.mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockRejectedValue(error),
    }));

    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await getBookings(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
