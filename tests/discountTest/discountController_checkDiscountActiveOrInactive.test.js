const { describe, it, expect } = require("@jest/globals");

const { checkDiscountActiveOrInactive } = require("../../controllers/discountController");
const Discount = require("../../models/discountModel");

jest.mock("../../models/discountModel", () => {
  return {
    findById: jest.fn(),
  };
});

describe("checkDiscountActiveOrInactive", () => {
  it("should throw an error if the discount is not found", async () => {
    // Mock Discount.findById to return null (discount not found)
    Discount.findById.mockResolvedValue(null);

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await expect(checkDiscountActiveOrInactive("nonexistent-id")).rejects.toThrow(
      "Discount not found"
    );

    // Ensure error is logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error checking discount status:", "Discount not found"
    );

    consoleErrorSpy.mockRestore();
  });

  it("should throw an error if the discount is expired (Inactive status)", async () => {
    // Mock a discount with status "Inactive"
    const discount = { status: "Inactive" };
    Discount.findById.mockResolvedValue(discount);

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await expect(checkDiscountActiveOrInactive("discount-id")).rejects.toThrow(
      "Discount is expired and cannot be used"
    );

    consoleErrorSpy.mockRestore();
  });

  it("should not throw an error if the discount is active", async () => {
    // Mock an active discount
    const discount = { status: "Active" };
    Discount.findById.mockResolvedValue(discount);

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    // The function should not throw an error for an active discount
    await expect(checkDiscountActiveOrInactive("discount-id")).resolves.not.toThrow();

    consoleErrorSpy.mockRestore();
  });

  it("should handle unexpected errors", async () => {
    // Mock Discount.findById to throw an unexpected error
    Discount.findById.mockRejectedValue(new Error("Database error"));

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await expect(checkDiscountActiveOrInactive("discount-id")).rejects.toThrow(
      "Database error"
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error checking discount status:", "Database error"
    );

    consoleErrorSpy.mockRestore();
  });
});
