const Discount = require("../models/discount");

const getDiscounts = async (req, res, next) => {
  try {
    const discounts = await Discount.find();
    if (!discounts) {
      res.status(404);
      throw new Error("There are no discounts available");
    }
    return res.status(200).json(discounts);
  } catch (error) {
    next(error);
  }
};

const getDiscount = async (req, res, next) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) {
      res.status(404);
      throw new Error("There is no discount by this ID");
    }
    return res.status(200).json(discount);
  } catch (error) {
    next(error);
  }
};

const createDiscount = async (req, res, next) => {
  try {
    const { code, discount, start_date, end_date, status } = req.body;
    const newDiscount = new Discount({
      code,
      discount,
      start_date,
      end_date,
      status,
    });
    if (!code) {
      res.status(400);
      throw new Error("Code is required");
    }
    if (!discount) {
      res.status(400);
      throw new Error("Discount is required");
    }
    if (!start_date) {
      res.status(400);
      throw new Error("Start Date is required");
    }
    if (!end_date) {
      res.status(400);
      throw new Error("End Date is required");
    }
    const savedDiscount = await newDiscount.save();
    return res.status(201).json(savedDiscount);
  } catch (error) {
    next(error);
  }
};

const updateDiscount = async (req, res, next) => {
  try {
    const { code, discount, start_date, end_date, status } = req.body;
    const updateField = {};
    if (code) updateField.code = code;
    if (discount) updateField.discount = discount;
    if (start_date) updateField.start_date = start_date;
    if (end_date) updateField.end_date = end_date;
    if (status) updateField.status = status;
    if (Object.keys(updateField).length === 0) {
      res.status(400);
      throw new Error("Please provide fields to update");
    }
    for (let i in updateField) {
      if (!updateField[i] || updateField[i] === "") {
        res.status(400);
        throw new Error(`${i} is required`);
      }
    }
    const diiscount = await Discount.findByIdAndUpdate(
      req.params.id,
      updateField,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!diiscount) {
      res.status(404);
      throw new Error("There is no discount by this ID");
    }
    return res.status(200).json(diiscount);
  } catch (error) {
    next(error);
  }
};

const deleteDiscount = async (req, res, next) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount) {
      res.status(404);
      throw new Error("There is no discount by this ID");
    }
    return res.status(200).json(discount);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDiscounts,
  getDiscount,
  createDiscount,
  updateDiscount,
  deleteDiscount,
};
