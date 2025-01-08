const { describe, it, expect } = require('@jest/globals');
const { getRooms } = require('../../controllers/roomController');
const Room = require('../../models/roomModel');

jest.mock('../../models/roomModel');

describe('getRooms Controller', () => {
  it('should return a 404 error if no rooms are found', async () => {
    Room.find.mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    }));
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await getRooms(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 404, message: 'There are no rooms available' }));
  });

  it('should return a 200 status and the rooms if found', async () => {
    const mockRooms = [
      {
        _id: '123',
        room_type: 'Single',
        room_number: 101,
        price: 100,
        status: 'Available',
        hotel: 150,
        amenities: [121, 122],
      },
    ];
    Room.find.mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockRooms),
    }));
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await getRooms(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockRooms);
  });

  it('should handle unexpected errors and pass them to the next middleware', async () => {
    const error = new Error('Unexpected error');
    Room.find.mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockRejectedValue(error),
    }));
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await getRooms(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
