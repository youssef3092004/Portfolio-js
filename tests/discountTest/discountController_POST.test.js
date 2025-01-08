const { describe, it, expect } = require("@jest/globals");

jest.mock("../../models/discountModel", () => {
  return jest.fn().mockImplementation(() => {
    return {
      save: jest.fn(),
    };
  });
});

let { createDiscount } = require("../../controllers/discountController");
const Discount = require("../../models/discountModel");

describe("createDiscount Controller", () => {
  it("should return a 400 error if code is missing", async () => {
    const req = {
      body: {
        discount: 20,
        start_date: "2025-01-01",
        end_date: "2025-01-05",
        maxUse: 100,
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await createDiscount(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(new Error("Code is required"));
  });

  it("should return a 400 error if discount is missing", async () => {
    const req = {
      body: {
        code: "SUMMER20",
        start_date: "2025-01-01",
        end_date: "2025-01-05",
        maxUse: 100,
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await createDiscount(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(new Error("Discount is required"));
  });

  it("should return a 400 error if start_date is missing", async () => {
    const req = {
      body: {
        code: "SUMMER20",
        discount: 20,
        end_date: "2025-01-05",
        maxUse: 100,
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await createDiscount(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(new Error("Start Date is required"));
  });

  it("should return a 400 error if end_date is missing", async () => {
    const req = {
      body: {
        code: "SUMMER20",
        discount: 20,
        start_date: "2025-01-01",
        maxUse: 100,
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await createDiscount(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(new Error("End Date is required"));
  });

  it("should return a 400 error if maxUse is missing", async () => {
    const req = {
      body: {
        code: "SUMMER20",
        discount: 20,
        start_date: "2025-01-01",
        end_date: "2025-01-05",
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await createDiscount(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(new Error("Max Use is required"));
  });

  it("should return a 400 error if start_date is greater than end_date", async () => {
    const req = {
      body: {
        code: "SUMMER20",
        discount: 20,
        start_date: "2025-01-06",
        end_date: "2025-01-05",
        maxUse: 100,
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await createDiscount(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(new Error("Invalid start or end date"));
  });

  it("should return a 400 error if discount is less than or equal to 0", async () => {
    const req = {
      body: {
        code: "SUMMER20",
        discount: 0, // setting discount to 0
        start_date: "2025-01-01",
        end_date: "2025-01-05",
        maxUse: 100,
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await createDiscount(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(
      new Error("The discount should be Greater than 0")
    );
  });

  const mockDiscount = {
    code: "SUMMER20",
    discount: 20,
    start_date: "2025-01-01",
    end_date: "2025-01-05",
    maxUse: 100,
  };

  it("should create a new discount and return 201 status", async () => {
    // Create a mock instance of Discount
    const discountInstance = {
      save: jest.fn().mockResolvedValue(mockDiscount),
    };

    // Mock the Discount constructor to return the mock instance
    Discount.mockImplementation(() => discountInstance); // Mock the Discount constructor to return the mock instance

    const req = { body: mockDiscount };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await createDiscount(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockDiscount);
  });

    it("should handle unexpected errors and return 500 status", async () => {
      const error = new Error("Unexpected error");
  
      const req = { body: mockDiscount }; // Replace with your mock discount data
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
  
      // Mock the save method to throw an error
      Discount.mockImplementationOnce(() => ({
        save: jest.fn().mockRejectedValue(error),
      }));
  
      await createDiscount(req, res, next);
  
      // Ensure that the next function is called with the error
      expect(next).toHaveBeenCalledWith(error);
    });
});
