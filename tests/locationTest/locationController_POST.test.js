const { describe, it, expect } = require("@jest/globals");
const { createLocation } = require("../../controllers/locationController");
const Location = require("../../models/locationModel");

jest.mock("../../models/locationModel");

describe("createLocation Controller", () => {
  const mockLocation = {
    id: "123",
    country: "EGYPT",
    city: "Cairo",
    address: "123 try try try",
    zip_code: 1231,
  };

  it("should return a 404 error if country is missing", async () => {
    const req = {
      body: {
        city: "Cairo",
        address: "123 try try try",
        zip_code: 1231,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await createLocation(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Country is required" })
    );
  });

  it("should return a 404 error if city is missing", async () => {
    const req = {
      body: {
        country: "Test Country",
        address: "Test Address",
        zip_code: "12345",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await createLocation(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "City is required" })
    );
  });

  it("should return a 404 error if address is missing", async () => {
    const req = {
      body: {
        country: "EGYPT",
        city: "Cairo",
        zip_code: 1231,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await createLocation(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Address is required" })
    );
  });

  it("should return a 404 error if zip_code is missing", async () => {
    const req = {
      body: {
        country: "EGYPT",
        city: "Cairo",
        address: "123 try try try",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await createLocation(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Zip Code is required" })
    );
  });

  it("should return the saved location when all fields are provided", async () => {
    const req = {
      body: {
        country: "EGYPT",
        city: "Cairo",
        address: "123 try try try",
        zip_code: 1231,
      },
    };
    Location.prototype.save.mockResolvedValue(mockLocation);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await createLocation(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockLocation);
  });

  it("should return a 500 error if there is a database error", async () => {
    const req = {
      body: {
        country: "EGYPT",
        city: "Cairo",
        address: "123 try try try",
        zip_code: 1231,
      },
    };
    Location.prototype.save.mockRejectedValue(new Error("Database error"));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await createLocation(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(res.status).not.toHaveBeenCalled();
  });
});
