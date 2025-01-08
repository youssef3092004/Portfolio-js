const { describe, it, expect } = require("@jest/globals");

jest.mock("../../models/discountModel", () => {
  return {
    findByIdAndUpdate: jest.fn(),
  };
});

const { updateDiscount } = require("../../controllers/discountController");
const Discount = require("../../models/discountModel");

describe("updateDiscount Controller", () => {
  it("should return a 400 error if no fields are provided to update", async () => {
    const req = {
      params: { id: "123" },
      body: {}, // No fields in the body
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await updateDiscount(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(new Error("Please provide fields to update"));
  });

  it("should return a 400 error if a required field is empty", async () => {
    const req = {
      params: { id: "123" },
      body: {
        discount: "", // Empty discount field
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await updateDiscount(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(new Error("Please provide fields to update"));
  });

  it("should return a 404 error if no discount is found by the given ID", async () => {
    // Mock the findByIdAndUpdate method to return null, simulating no discount found
    Discount.findByIdAndUpdate.mockResolvedValue(null);

    const req = {
      params: { id: "123" },
      body: {
        discount: 20,
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await updateDiscount(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(new Error("There is no discount by this ID"));
  });

  it('should return a 200 status and updated discount if the update is successful', async () => {
    const req = {
      params: { id: '123' },
      body: { code: 'NEWCODE', discount: 20 }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    const updatedDiscount = {
      code: 'NEWCODE',
      discount: 20,
      updated_at: Date.now()
    };

    Discount.findByIdAndUpdate.mockResolvedValue(updatedDiscount);
    updatedDiscount.save = jest.fn().mockResolvedValue(updatedDiscount);

    await updateDiscount(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedDiscount);
  });

  it('should return a 400 status if no fields are provided to update', async () => {
    const req = {
      params: { id: '123' },
      body: {}
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    await updateDiscount(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });


  it("should handle unexpected errors and pass them to the next middleware", async () => {
    const error = new Error("Unexpected error");
    
    // Mocking findByIdAndUpdate to throw an error
    Discount.findByIdAndUpdate.mockRejectedValue(error);

    const req = {
      params: { id: "123" },
      body: {
        discount: 20,
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await updateDiscount(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
