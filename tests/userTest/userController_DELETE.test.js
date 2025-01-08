const { describe, it, expect } = require("@jest/globals");

const { deleteUser } = require("../../controllers/userController");
const User = require("../../models/userModel");

jest.mock("../../models/userModel");

describe("deleteUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if the user with the given ID does not exist", async () => {
    const req = {
      params: { id: "123" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    User.findByIdAndDelete.mockResolvedValue(null);

    await deleteUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(new Error("no user with this id123"));
  });

  it("should delete the user successfully if the user exists", async () => {
    const req = {
      params: { id: "123" },
    };
    const user = {
      _id: "123",
      username: "Youssef",
      fname: "Ahmed",
      lname: "Youssef",
      address: "123 try try",
      phone: "1234567890",
      email: "youssef@gmail.com",
    };

    User.findByIdAndDelete.mockResolvedValue(user);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await deleteUser(req, res, next);

    expect(User.findByIdAndDelete).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: "the user has been deleted Successfuly",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle unexpected errors", async () => {
    const req = {
      params: { id: "123" },
    };
    const error = new Error("Unexpected error");
    User.findByIdAndDelete.mockRejectedValue(error);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await deleteUser(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
