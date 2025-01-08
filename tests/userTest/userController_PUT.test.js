const { describe, it, expect } = require("@jest/globals");

const { updateUser } = require("../../controllers/userController");
const User = require("../../models/userModel");
const bcrypt = require("bcrypt");

jest.mock("../../models/userModel");
jest.mock("bcrypt");

describe("updateUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if no fields are provided for update", async () => {
    const req = {
      params: { id: "123" },
      body: {}, // No fields to update
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await updateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(
      new Error("No fields provided for update")
    );
  });

  it("should return 400 if the user ID does not exist", async () => {
    const req = {
      params: { id: "123" },
      body: {
        id: "123",
        username: "",
        fname: "Youssef",
        lname: "Ahmed",
        address: "123 try try",
        phone: "1234567890",
        email: "youssef@gmail.com",
        password: "123123",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    User.findByIdAndUpdate.mockResolvedValue(null);

    await updateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(new Error("no user with this id123"));
  });

  it("should update the user successfully when valid fields are provided", async () => {
    const req = {
      params: { id: "123" },
      body: {
        id: "123",
        username: "",
        fname: "Youssef",
        lname: "Ahmed",
        address: "123 try try",
        phone: "1234567890",
        email: "youssef@gmail.com",
        password: "123123",
      },
    };
    const hashedPassword = "hashed_123123";
    bcrypt.hash.mockResolvedValue(hashedPassword);

    const updatedUser = {
      _id: "123",
      username: "",
      fname: "Youssef",
      lname: "Ahmed",
      address: "123 try try",
      phone: "1234567890",
      email: "youssef@gmail.com",
      password: hashedPassword,
    };

    User.findByIdAndUpdate.mockResolvedValue(updatedUser);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await updateUser(req, res, next);

    expect(bcrypt.hash).toHaveBeenCalledWith("123123", 10);
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "123",
      {
        fname: "Youssef",
        lname: "Ahmed",
        address: "123 try try",
        phone: "1234567890",
        email: "youssef@gmail.com",
        password: hashedPassword,
      },
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedUser);
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle unexpected errors", async () => {
    const req = {
      params: { id: "123" },
      body: {
        id: "123",
        username: "",
        fname: "Youssef",
        lname: "Ahmed",
        address: "123 try try",
        phone: "1234567890",
        email: "youssef@gmail.com",
        password: "123123",
      },
    };
    const error = new Error("Unexpected error");
    User.findByIdAndUpdate.mockRejectedValue(error);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await updateUser(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
