const { describe, it, expect } = require('@jest/globals');
const { getLocation } = require("../../controllers/locationController");
const Location = require("../../models/locationModel");

jest.mock("../../models/locationModel");

describe("getLocation Controller", () => {
  it("should return a 404 error if location is not found", async () => {
    // Mock Location.findById to return null (no location found)
    Location.findById.mockResolvedValue(null);

    const req = { params: { id: "123" } }; // simulate an ID parameter
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getLocation(req, res, next);

    // Check if the status 404 is called
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(expect.any(Error)); // Ensure the error is passed to next
  });

  it("should return the location if found", async () => {
    const mockLocation = {
      id: "123",
      country: "EGYPT",
      city: "Cairo",
      address: "123 try try try",
      zip_code: 1231,
    };

    // Mock Location.findById to return the mock location
    Location.findById.mockResolvedValue(mockLocation);

    const req = { params: { id: "123" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getLocation(req, res, next);

    // Check if status 200 is called and the correct location is returned
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockLocation);
  });

  it("should return a 500 error if there is a database error", async () => {
    // Mock Location.findById to throw an error
    Location.findById.mockRejectedValue(new Error("Database error"));

    const req = { params: { id: "12345" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getLocation(req, res, next);

    // Ensure next() is called with an error
    expect(next).toHaveBeenCalledWith(expect.any(Error)); // This ensures the error is passed to the next handler
    expect(res.status).not.toHaveBeenCalled(); // The status code is set by the error handler
  });

});
