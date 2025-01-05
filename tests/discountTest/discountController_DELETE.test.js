const { describe, it, expect } = require("@jest/globals");

jest.mock("../../models/discountModel", () => {
  return {
    findByIdAndDelete: jest.fn(),
  };
});

let { deleteDiscount } = require("../../controllers/discountController");
const Discount = require("../../models/discountModel");

describe("deleteDiscount Controller", () => {
  it("should return a 404 error if no discount is found by the given ID", async () => {
    // Mock the findByIdAndDelete method to return null, simulating no discount found
    Discount.findByIdAndDelete.mockResolvedValue(null);

    const req = {
      params: { id: "123" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await deleteDiscount(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(new Error("There is no discount by this ID"));
  });

  it("should return a 200 status and the deleted discount if deletion is successful", async () => {
    const req = {
      params: { id: "123" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    const deletedDiscount = {
      _id: "123",
      code: "SUMMER20",
      discount: 15,
    };

    // Mock the findByIdAndDelete method to return the discount being deleted
    Discount.findByIdAndDelete.mockResolvedValue(deletedDiscount);

    await deleteDiscount(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(deletedDiscount);
  });

  it("should handle unexpected errors and pass them to the next middleware", async () => {
    const error = new Error("Unexpected error");

    // Mocking findByIdAndDelete to throw an error
    Discount.findByIdAndDelete.mockRejectedValue(error);

    const req = {
      params: { id: "123" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await deleteDiscount(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
