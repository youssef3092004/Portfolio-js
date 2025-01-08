const { describe, it, expect } = require("@jest/globals");

const { getLocations } = require("../../controllers/locationController");
const Location = require("../../models/locationModel");

jest.mock("../../models/locationModel", () => {
  return {
    find: jest.fn(),
  };
});

describe("getLocations Controller", () => {
  it("should return a 404 error if no locations are found", async () => {
    Location.find.mockResolvedValue(null);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getLocations(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should return locations when found", async () => {
    const mockLocations = [
      {
        id: "1",
        country: "USA",
        city: "New York",
        address: "123 NY St",
        zip_code: 10001,
      },
      {
        id: "2",
        country: "Canada",
        city: "Toronto",
        address: "456 Toronto St",
        zip_code: 23456,
      },
    ];
    Location.find.mockResolvedValue(mockLocations);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getLocations(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockLocations);
  });

  it("should return a 404 error if no locations are found (empty array)", async () => {
    Location.find.mockResolvedValue([]);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getLocations(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should return a 500 error if there is a database error", async () => {
    // Mock the database call to reject with an error
    Location.find.mockRejectedValue(new Error("Database error"));

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getLocations(req, res, next);

    // Check if the status 500 is called
    expect(next).toHaveBeenCalledWith(expect.any(Error)); // This ensures the error is passed to the next handler
    expect(res.status).not.toHaveBeenCalled();
  });
});
