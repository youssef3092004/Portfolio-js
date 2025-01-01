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
