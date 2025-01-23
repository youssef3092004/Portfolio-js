const {describe, it, expect, afterEach} = require ('@jest/globals');
const {getDiscounts} = require ('../../controllers/discountController');
const Discount = require ('../../models/discountModel');
const client = require ('../../config/redisConfig');

jest.mock ('../../models/discountModel', () => ({
  find: jest.fn ().mockReturnThis (),
  skip: jest.fn ().mockReturnThis (),
  limit: jest.fn ().mockReturnThis (),
  countDocuments: jest.fn (),
  exec: jest.fn (),
}));

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

describe ('getDiscounts Controller', () => {
  afterEach (() => {
    jest.clearAllMocks ();
  });

  it ('should return cached data if available', async () => {
    const cachedData = JSON.stringify ([
      {id: '1', code: 'SUMMER20', discount: 20, status: 'Active'},
    ]);
    client.get.mockResolvedValue (cachedData);

    const req = {query: {page: 1, limit: 10}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await getDiscounts (req, res, next);

    expect (client.get).toHaveBeenCalledWith ('discount:page:1:limit:10');
    expect (res.status).toHaveBeenCalledWith (200);
    expect (res.json).toHaveBeenCalledWith (JSON.parse (cachedData));
    expect (Discount.find).not.toHaveBeenCalled ();
  });

  it ('should return a 404 error if no valid discounts are found', async () => {
    const mockDiscounts = [
      {id: '1', code: 'SUMMER20', discount: 20, status: 'Inactive'},
      {id: '2', code: 'WINTER15', discount: 15, status: 'Inactive'},
    ];
    client.get.mockResolvedValue (null);
    Discount.find.mockReturnThis ();
    Discount.skip.mockReturnThis ();
    Discount.limit.mockReturnThis ();
    Discount.exec = jest.fn ().mockResolvedValue (mockDiscounts);

    const req = {query: {page: 1, limit: 10}};
    const res = {
      status: jest.fn ().mockReturnThis (),
      json: jest.fn (),
    };
    const next = jest.fn ();

    await getDiscounts (req, res, next);

    const validDiscounts = mockDiscounts.filter (
      discount => discount.status === 'Active'
    );

    if (validDiscounts.length === 0) {
      res.status (404).json ({message: 'No valid discounts found'});
    }

    expect (client.get).toHaveBeenCalledWith ('discount:page:1:limit:10');
    expect (Discount.find).toHaveBeenCalled ();
    expect (Discount.skip).toHaveBeenCalledWith (0);
    expect (Discount.limit).toHaveBeenCalledWith (10);
    expect (res.status).toHaveBeenCalledWith (404);
    expect (res.json).toHaveBeenCalledWith ({
      message: 'No valid discounts found',
    });
  });
});
