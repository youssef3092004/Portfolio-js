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
      const { code, discount, start_date, end_date, status, maxUse } = req.body;
      if (!code) {
        res.status(400);
        throw new Error("Code is required");
      }
      if (discount <= 0 ) {
        res.status(400);
        throw new Error("The discount should be Greater than 0");
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
      if (!maxUse) {
        res.status(400);
        throw new Error("Max Use is required");
      }
      if (start_date > end_date || start_date < Date.now()) {
        res.status(400);
        throw new Error("Invalid start or end date");
      }
      const newDiscount = new Discount({
        code,
        discount,
        start_date,
        end_date,
        status,
        maxUse,
      });
      const savedDiscount = await newDiscount.save();
      return res.status(201).json(savedDiscount);
    } catch (error) {
      next(error);
    }
  };
  
