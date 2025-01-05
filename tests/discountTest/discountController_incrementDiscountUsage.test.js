const { describe, it, expect } = require("@jest/globals");

jest.mock("../../models/discountModel", () => {
  return {
    findById: jest.fn(),
  };
});

let { incrementDiscountUsage } = require("../../controllers/discountController");
const Discount = require("../../models/discountModel");

describe("incrementDiscountUsage Function", () => {
  it("should throw an error if the discount is not found", async () => {
    // Mock the findById method to return null, simulating discount not found
    Discount.findById.mockResolvedValue(null);

    const discountId = "123";

    await expect(incrementDiscountUsage(discountId)).rejects.toThrow(
      "Discount not found"
    );
  });

  it("should throw an error if the discount has reached its maximum usage", async () => {
    // Mock the findById method to return a discount object with usedCount >= maxUse
    Discount.findById.mockResolvedValue({
      _id: "123",
      usedCount: 5,
      maxUse: 5,
      status: "Active",
      save: jest.fn(),
    });

    const discountId = "123";

    await expect(incrementDiscountUsage(discountId)).rejects.toThrow(
      "Discount has reached its maximum usage"
    );
  });

  it("should increment the discount usage and update the status if max usage is reached", async () => {
    // Mock the findById method to return a discount with usedCount less than maxUse
    const discount = {
      _id: "123",
      usedCount: 4,
      maxUse: 5,
      status: "Active",
      updated_at: null,
      save: jest.fn().mockResolvedValue(this),
    };
    Discount.findById.mockResolvedValue(discount);

    const discountId = "123";

    const updatedDiscount = await incrementDiscountUsage(discountId);

    expect(updatedDiscount.usedCount).toBe(5); // The used count should have been incremented
    expect(updatedDiscount.status).toBe("Inactive"); // The status should have been set to Inactive
    expect(discount.save).toHaveBeenCalled(); // Ensure save was called to persist changes
  });

  it("should successfully increment discount usage without reaching max usage", async () => {
    // Mock the findById method to return a discount with usedCount less than maxUse
    const discount = {
      _id: "123",
      usedCount: 3,
      maxUse: 5,
      status: "Active",
      updated_at: null,
      save: jest.fn().mockResolvedValue(this),
    };
    Discount.findById.mockResolvedValue(discount);

    const discountId = "123";

    const updatedDiscount = await incrementDiscountUsage(discountId);

    expect(updatedDiscount.usedCount).toBe(4); // The used count should have been incremented
    expect(updatedDiscount.status).toBe("Active"); // The status should remain Active
    expect(discount.save).toHaveBeenCalled(); // Ensure save was called to persist changes
  });

  it("should handle unexpected errors and throw them", async () => {
    const error = new Error("Unexpected error");

    // Mocking findById to throw an error
    Discount.findById.mockRejectedValue(error);

    const discountId = "123";

    await expect(incrementDiscountUsage(discountId)).rejects.toThrow(
      "Unexpected error"
    );
  });
});
