const { describe, it, expect } = require("@jest/globals");

const { getUser } = require("../../controllers/userController");
const User = require("../../models/userModel");

jest.mock("../../models/userModel", () => {
  return {
    findById: jest.fn(),
  };
});

describe("getUser", () => {
  it("should return a 404 error if the user is not found", async () => {
    // Mock User.findById to return null (user not found)
    User.findById.mockResolvedValue(null);

    const req = { params: { id: "123" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getUser(req, res, next);

    // Ensure status 404 is set
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).not.toHaveBeenCalled(); // No response should be sent
    expect(next).toHaveBeenCalledWith(
      new Error("There are no users available")
    );
  });

  it("should return a 200 status with the user data if found", async () => {
    const mockUser = {
      id: "123",
      username: "joe404",
      fname: "Youssef",
      lname: "Ahmed",
      address: "123 try try",
      phone: "1234567890",
      email: "youssef@gmail.com",
      password: "123123",
    };
    User.findById.mockResolvedValue(mockUser);

    const req = { params: { id: "123" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getUser(req, res, next);

    // Ensure status 200 is set and user data is returned
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle unexpected errors", async () => {
    // Mock User.findById to throw an unexpected error
    User.findById.mockRejectedValue(new Error("Database error"));

    const req = { params: { id: "123" } };
    const res = {};
    const next = jest.fn();

    await getUser(req, res, next);

    // Ensure the error is passed to next()
    expect(next).toHaveBeenCalledWith(new Error("Database error"));
  });
});
