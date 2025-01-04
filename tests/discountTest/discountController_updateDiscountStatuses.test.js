const { describe, it, expect } = require("@jest/globals");

const { updateDiscountStatuses } = require("../../controllers/discountController");
const Discount = require("../../models/discountModel");

jest.mock("../../models/discountModel", () => {
  return {
    find: jest.fn(),
  };
});

describe("updateDiscountStatuses", () => {
  it("should throw an error if no active discounts are found", async () => {
    // Mock Discount.find to return an empty array (no active discounts)
    Discount.find.mockResolvedValue([]);

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await updateDiscountStatuses();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error updating discount statuses:",
      "Discounts not found"
    );
    consoleErrorSpy.mockRestore();
  });

  it("should log the correct message when discounts are found and updated", async () => {
    // Mock some active discounts with valid `end_date` values
    const discounts = [
      { status: "Active", end_date: Date.now() - 1000, save: jest.fn() },
      { status: "Active", end_date: Date.now() + 1000, save: jest.fn() },
    ];
    Discount.find.mockResolvedValue(discounts);

    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    await updateDiscountStatuses();

    // Ensure that the status of the expired discount is set to 'Inactive' and save is called
    expect(discounts[0].status).toBe("Inactive");
    expect(discounts[0].save).toHaveBeenCalled();

    // Ensure the active discount is not updated
    expect(discounts[1].status).toBe("Active");
    expect(discounts[1].save).not.toHaveBeenCalled();

    // Ensure the correct log message is printed
    expect(consoleLogSpy).toHaveBeenCalledWith(
      `Checked and updated discount statuses for 2 discounts`
    );

    consoleLogSpy.mockRestore();
  });

  it("should handle unexpected errors", async () => {
    // Mock Discount.find to throw an error
    Discount.find.mockRejectedValue(new Error("Database error"));

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await updateDiscountStatuses();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error updating discount statuses:",
      "Database error"
    );
    consoleErrorSpy.mockRestore();
  });
});
