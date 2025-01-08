const { describe, it, expect } = require("@jest/globals");

// 1- Returns a 404 error when no discount is found
// 2- Returns a 200 status and the discount when a valid ID is provided

jest.mock("../../models/discountModel", () => {
  return {
    findById: jest.fn(),
  };
});

const { getDiscount } = require("../../controllers/discountController");
const Discount = require("../../models/discountModel");
describe("getDiscount Controller", () => {
  it("should return a 404 error if no discount is found", async () => {
    Discount.findById.mockResolvedValue(null);

    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getDiscount(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should return a valid discount", async () => {
    const mockDiscount = {
      code: "SUMMER20",
      discount: 20,
      startDate: "2022-06-01",
      endDate: "2022-06-30",
    };
    Discount.findById.mockResolvedValue(mockDiscount);

    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await getDiscount(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockDiscount);
    expect(next).not.toHaveBeenCalled();
  });
});
