const { describe, it, expect } = require('@jest/globals');

const { getUsers } = require("../../controllers/userController");
const User = require("../../models/userModel");

jest.mock("../../models/userModel", () => {
  return {
    find: jest.fn(),
  };
});

describe("getUsers", () => {
  it("should return a 404 error if there are no users", async () => {
    // Mock User.find to return an empty array (no users found)
    User.find.mockResolvedValue([]);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getUsers(req, res, next);

    // Ensure status 404 is set
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).not.toHaveBeenCalled(); // No response should be sent
    expect(next).toHaveBeenCalledWith(new Error("There are no users available"));
  });

  it("should return a 200 status with the users if found", async () => {
    // Mock User.find to return an array of users
    const mockUsers = [{ name: "User 1" }, { name: "User 2" }];
    User.find.mockResolvedValue(mockUsers);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getUsers(req, res, next);

    // Ensure status 200 is set and users are returned
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle unexpected errors", async () => {
    // Mock User.find to throw an unexpected error
    User.find.mockRejectedValue(new Error("Database error"));

    const req = {};
    const res = {};
    const next = jest.fn();

    await getUsers(req, res, next);

    // Ensure the error is passed to next()
    expect(next).toHaveBeenCalledWith(new Error("Database error"));
  });
});
