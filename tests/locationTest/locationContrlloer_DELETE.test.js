const { describe, it, expect } = require("@jest/globals");

let { deleteLocation } = require("../../controllers/locationController");
const Location = require("../../models/locationModel");

jest.mock("../../models/locationModel", () => {
  return {
    findByIdAndDelete: jest.fn(),
  };
});

describe("deleteLocation Controller", () => {
  it("should return a 404 error if the location is not found", async () => {
    Location.findByIdAndDelete.mockResolvedValue(null);
    const req = {
      params: { id: "123" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await deleteLocation(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(new Error("There is no location by this ID"));
  });

  it("should return a 200 status and the deleted location if successful", async () => {
    const mockLocation = {
      _id: "123",
      country: "EGYPT",
      city: "Cairo",
      address: "123 Try Try Try",
      zip_code: 1231,
    };
    Location.findByIdAndDelete.mockResolvedValue(mockLocation);

    const req = {
      params: { id: "123" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await deleteLocation(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockLocation);
  });

  it("should handle unexpected errors and pass them to the next middleware", async () => {
    const error = new Error("Unexpected error");
    Location.findByIdAndDelete.mockRejectedValue(error);

    const req = {
      params: { id: "123" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await deleteLocation(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
