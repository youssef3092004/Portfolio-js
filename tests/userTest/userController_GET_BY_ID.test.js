const { describe, it, expect } = require("@jest/globals");

const { getUser } = require("../../controllers/userController");
const User = require("../../models/userModel");

jest.mock("../../models/userModel", () => {
  return {
    findById: jest.fn(),
  };
});

describe("getUser", () => {
  it("should return a 200 status with the user data if found", async () => {
    const mockUser = {
      _id: "123",
      username: "",
      fname: "Youssef",
      lname: "Ahmed",
      address: "123 try try",
      phone: "1234567890",
      email: "youssef@gmail.com",
    };
    User.findById.mockResolvedValue(mockUser);

    const req = { params: { id: "123" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
    expect(next).not.toHaveBeenCalled();
  });
});
