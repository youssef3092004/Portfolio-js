const Discount = require("../models/discount");

const getDiscounts = async (req, res, next) => {
  try {
    const discounts = await Discount.find();
    if (!discounts) {
      res.status(404);
      throw new Error("There are no discounts available");
    }
    const validDiscounts = discounts.filter((discount) => {
      const startDate = new Date(discount.startDate);
      const endDate = new Date(discount.endDate);
      return startDate <= endDate;
    });

    if (validDiscounts.length === 0) {
      res.status(404);
      throw new Error("No valid discounts found");
    }

    return res.status(200).json(validDiscounts);
  } catch (error) {
    next(error);
  }
};
