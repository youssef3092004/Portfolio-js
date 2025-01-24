const {describe, it, expect, afterEach} = require ('@jest/globals');
const {updateRoom} = require ('../../controllers/roomController');

jest.mock ('../../models/roomModel', () => ({
  findByIdAndUpdate: jest.fn (),
}));

jest.mock ('../../config/redisConfig', () => ({
  setEx: jest.fn (),
}));

describe ('updateRoom Controller', () => {
  afterEach (() => {
    jest.clearAllMocks ();
  });

  it ('should return a 404 error if no fields are provided for update', async () => {
    const req = {params: {id: '1'}, body: {}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await updateRoom (req, res, next);

    expect (res.status).toHaveBeenCalledWith (404);
    expect (next).toHaveBeenCalledWith (expect.any (Error));
  });
});
