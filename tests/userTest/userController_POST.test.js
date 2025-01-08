const { describe, it, expect } = require("@jest/globals");

const { createUser } = require("../../controllers/userController");
const User = require("../../models/userModel");
const bcrypt = require("bcrypt");

jest.mock("../../models/userModel", () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn(),
  }));
});

jest.mock("bcrypt");

describe("createUser", () => {
  it("should return 404 if required fields are missing", async () => {
    const req = {
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

    await createUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(new Error("Username is required"));
  });

  it("should return 201 if user created successfully when all fields are provided", async () => {
    const req = {
      body: {
        id: "123",
        username: "joe404",
        fname: "Youssef",
        lname: "Ahmed",
        address: "123 try try",
        phone: "1234567890",
        email: "youssef@gmail.com",
        password: "123123",
      },
    };
    const hashedPassword = "hashed_password";
    bcrypt.hash.mockResolvedValue(hashedPassword);

    const mockUser = {
      ...req.body,
      password: hashedPassword,
      save: jest.fn().mockResolvedValue({
        ...req.body,
        password: hashedPassword,
        id: "123",
        created_at: new Date(),
        updated_at: new Date(),
      }),
    };
    User.mockImplementation(() => mockUser);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await createUser(req, res, next);

    expect(bcrypt.hash).toHaveBeenCalledWith("123123", 10);
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        username: "joe404",
        fname: "Youssef",
        lname: "Ahmed",
        address: "123 try try",
        phone: "1234567890",
        email: "youssef@gmail.com",
        password: hashedPassword,
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle unexpected errors", async () => {
    const req = {
      body: {
        username: "joe404",
        fname: "Youssef",
        lname: "Ahmed",
        address: "123 try try",
        phone: "1234567890",
        email: "youssef@gmail.com",
        password: "123123",
      },
    };
    const error = new Error("Database error");
    bcrypt.hash.mockResolvedValue("hashed_password");
    User.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(error),
    }));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await createUser(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
