const {describe, it, expect} = require ('@jest/globals');

const {
  updateDiscountStatuses,
} = require ('../../controllers/discountController');
const Discount = require ('../../models/discountModel');

jest.mock ('../../models/discountModel', () => {
  return {
    find: jest.fn (),
  };
});

describe ('updateDiscountStatuses', () => {
  it ('should throw an error if no active discounts are found', async () => {
    Discount.find.mockResolvedValue ([]);

    const consoleErrorSpy = jest.spyOn (console, 'error').mockImplementation ();

    await updateDiscountStatuses ();

    expect (consoleErrorSpy).toHaveBeenCalledWith (
      'Error updating discount statuses:',
      'Discounts not found'
    );
    consoleErrorSpy.mockRestore ();
  });

  it ('should log the correct message when discounts are found and updated', async () => {
    const discounts = [
      {status: 'Active', end_date: Date.now () - 1000, save: jest.fn ()},
      {status: 'Active', end_date: Date.now () + 1000, save: jest.fn ()},
    ];
    Discount.find.mockResolvedValue (discounts);

    const consoleLogSpy = jest.spyOn (console, 'log').mockImplementation ();

    await updateDiscountStatuses ();

    expect (discounts[0].status).toBe ('Inactive');
    expect (discounts[0].save).toHaveBeenCalled ();

    expect (discounts[1].status).toBe ('Active');
    expect (discounts[1].save).not.toHaveBeenCalled ();

    expect (consoleLogSpy).toHaveBeenCalledWith (
      `Checked and updated discount statuses for 2 discounts`
    );

    consoleLogSpy.mockRestore ();
  });

  it ('should handle unexpected errors', async () => {
    Discount.find.mockRejectedValue (new Error ('Database error'));

    const consoleErrorSpy = jest.spyOn (console, 'error').mockImplementation ();

    await updateDiscountStatuses ();

    expect (consoleErrorSpy).toHaveBeenCalledWith (
      'Error updating discount statuses:',
      'Database error'
    );
    consoleErrorSpy.mockRestore ();
  });
});
