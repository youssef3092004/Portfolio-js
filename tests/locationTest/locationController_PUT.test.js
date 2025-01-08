const { describe, it, expect } = require("@jest/globals");

jest.mock("../../models/locationModel", () => {
  return {
    findByIdAndUpdate: jest.fn(),
  };
});

const { updateLocation } = require("../../controllers/locationController");
const Location = require("../../models/locationModel");

describe("updateLocation Controller", () => {
  it("should return a 400 error if no fields are provided to update", async () => {
    const req = {
      params: { id: "123" },
      body: {},
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await updateLocation(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(
      new Error("Please provide fields to update")
    );
  });

  it("should return a 400 error if a required field is empty", async () => {
    const req = {
      params: { id: "123" },
      body: {
        country: "",
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await updateLocation(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Please provide fields to update" })
    );
  });

  it("should return a 404 error if no location is found by the given ID", async () => {
    Location.findByIdAndUpdate.mockResolvedValue(null);
    const req = {
      params: { id: "123" },
      body: {
        country: "USA",
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await updateLocation(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(
      new Error("There is no location by this ID")
    );
  });

  it("should return a 200 status and updated location if the update is successful", async () => {
    const req = {
      params: { id: "123" },
      body: { country: "USA", city: "New York" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    const updatedLocation = {
      id: "123",
      country: "USA",
      city: "New York",
      address: "123 try try try",
      zip_code: 1231,
      updated_at: Date.now(),
    };
    Location.findByIdAndUpdate.mockResolvedValue(updatedLocation);
    updatedLocation.save = jest.fn().mockResolvedValue(updatedLocation);
    await updateLocation(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Location updated successfully",
      data: updatedLocation,
    });
  });

  it("should handle unexpected errors and pass them to the next middleware", async () => {
    const error = new Error("Unexpected error");
    Location.findByIdAndUpdate.mockRejectedValue(error);
    const req = {
      params: { id: "123" },
      body: {
        country: "USA",
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await updateLocation(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
