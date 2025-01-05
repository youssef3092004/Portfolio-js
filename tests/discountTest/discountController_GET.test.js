const { describe, it, expect} = require("@jest/globals");

// 1- No discounts found.
// 2- Valid discounts found.
// 3- No valid discounts after filtering.
// 4- Filtering logic for invalid date ranges.

jest.mock("../../models/discountModel", () => {
  return {
    find: jest.fn(),
  };
});

const { getDiscounts } = require("../../controllers/discountController");
const Discount = require("../../models/discountModel");

describe("getDiscounts Controller", () => {
  it("should return a 404 error if no discounts are found", async () => {
    Discount.find.mockResolvedValue(null);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getDiscounts(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should return valid discounts", async () => {
    const mockDiscounts = [
      {
        code: "SUMMER20",
        discount: 20,
        startDate: "2022-06-01",
        endDate: "2022-06-30",
      },
      {
        code: "WINTER15",
        discount: 15,
        startDate: "2025-12-01",
        endDate: "2025-12-31",
      },
    ];
    Discount.find.mockResolvedValue(mockDiscounts);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getDiscounts(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockDiscounts);
  });

  it("should return a 404 error if no valid discounts are found", async () => {
    const mockDiscounts = [
      {
        code: "SUMMER20",
        discount: 20,
        startDate: "2022-06-01",
        endDate: "2021-06-30",
      },
      {
        code: "WINTER15",
        discount: 15,
        startDate: "2025-12-01",
        endDate: "2025-01-01",
      },
    ];

    Discount.find.mockResolvedValue(mockDiscounts);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getDiscounts(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should filter out discounts with invalid dates and return valid ones", async () => {
    const mockDiscounts = [
      {
        code: "SUMMER20",
        discount: 20,
        startDate: "2022-06-01",
        endDate: "2021-06-30",
      },
      {
        code: "WINTER15",
        discount: 15,
        startDate: "2025-12-01",
        endDate: "2025-12-31",
      },
    ];

    Discount.find.mockResolvedValue(mockDiscounts);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getDiscounts(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        code: "WINTER15",
        discount: 15,
        startDate: "2025-12-01",
        endDate: "2025-12-31",
      },
    ]);
  });
});
