const Discount = require("../models/discountModel");

/**
 * @function getDiscounts
 * @desc Fetches all the discounts from the database.
 * @access Public
 * @throws {Error} If no discounts are found, returns a 404 status with a relevant error message.
 * @returns {Array} An array of discounts.
 *
 * This function retrieves all discounts stored in the database. If no discounts are found, an error is thrown with a 404 status code.
 * On successful retrieval, it returns the discounts with a 200 status code.
 */
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

/**
 * @function getDiscount
 * @desc Fetches a single discount by its ID.
 * @access Public
 * @param {String} req.params.id - The unique identifier of the discount.
 * @throws {Error} If no discount is found by the provided ID, returns a 404 status with a relevant error message.
 * @returns {Object} A single discount object.
 *
 * This function retrieves a discount by its ID from the database. If no discount is found, an error is thrown with a 404 status code.
 * On success, it returns the discount with a 200 status code.
 */
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

/**
 * @function createDiscount
 * @desc Creates a new discount and saves it to the database.
 * @access Public
 * @param {Object} req.body - The data to create a new discount.
 * @throws {Error} If any required field is missing, returns a 400 status with a relevant error message.
 * @returns {Object} The created discount object.
 *
 * This function creates a new discount and saves it to the database. It requires the following fields: code, discount, start_date, end_date,
 * status, and maxUse. If any of these fields are missing, a 400 status code error is returned. Upon successful creation, it returns the discount
 * with a 201 status code.
 */
const createDiscount = async (req, res, next) => {
  try {
    const { code, discount, start_date, end_date, status, maxUse } = req.body;
    const newDiscount = new Discount({
      code,
      discount,
      start_date,
      end_date,
      status,
      maxUse,
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
    if (!maxUse) {
      res.status(400);
      throw new Error("Max Use is required");
    }
    const savedDiscount = await newDiscount.save();
    return res.status(201).json(savedDiscount);
  } catch (error) {
    next(error);
  }
};

/**
 * @function updateDiscount
 * @desc Updates an existing discount by its ID.
 * @access Public
 * @param {String} req.params.id - The unique identifier of the discount.
 * @param {Object} req.body - The fields to update.
 * @throws {Error} If no discount is found by the provided ID or if no fields are provided for update, returns a 400 or 404 status with relevant error messages.
 * @returns {Object} The updated discount object.
 *
 * This function updates an existing discount by its ID with the provided fields in the request body. If no fields are provided for update, a 400
 * status code is returned. If the discount with the given ID does not exist, a 404 status code error is returned. On success, the updated discount
 * is returned with a 200 status code.
 */
const updateDiscount = async (req, res, next) => {
  try {
    const { code, discount, start_date, end_date, status, maxUse } = req.body;
    const updateField = {};
    if (code) updateField.code = code;
    if (discount) updateField.discount = discount;
    if (start_date) updateField.start_date = start_date;
    if (end_date) updateField.end_date = end_date;
    if (status) updateField.status = status;
    if (maxUse) updateField.maxUse = maxUse;
    if (Object.keys(updateField).length === 0) {
      res.status(400);
      throw new Error("Please provide fields to update");
    }
    for (let i in updateField) {
      if (!updateField[i] || updateField[i] === "") {
        res.status(400);
        throw new Error(`${updateField[i]} is required`);
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
    diiscount.updated_at = Date.now();
    const savedDiscount = await diiscount.save();
    return res.status(200).json(savedDiscount);
  } catch (error) {
    next(error);
  }
};

/**
 * @function deleteDiscount
 * @desc Deletes a discount by its ID.
 * @access Public
 * @param {String} req.params.id - The unique identifier of the discount.
 * @throws {Error} If no discount is found by the provided ID, returns a 404 status with a relevant error message.
 * @returns {Object} The deleted discount object.
 *
 * This function deletes a discount by its ID from the database. If no discount is found by the provided ID, a 404 status code error is thrown.
 * If successful, the deleted discount is returned with a 200 status code.
 */
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

/**
 * @function incrementDiscountUsage
 * @desc Increments the usage count of a discount and marks it as inactive if the maximum usage limit is reached.
 * @param {String} discountId - The unique identifier of the discount.
 * @throws {Error} If the discount is not found or if the maximum usage limit is reached, returns an error.
 * @returns {Object} The updated discount object.
 *
 * This function increments the `usedCount` of a discount and checks if the maximum usage limit has been reached. If the limit is reached, the
 * discount status is set to "Inactive". If the discount is not found or if it has already reached its maximum usage, an error is thrown.
 */
const incrementDiscountUsage = async (discountId) => {
  try {
    const discount = await Discount.findById(discountId);
    if (!discount) {
      throw new Error("Discount not found");
    }
    if (discount.usedCount >= discount.maxUse) {
      throw new Error("Discount has reached its maximum usage");
    }
    discount.usedCount += 1;
    if (discount.usedCount == discount.maxUse) {
      discount.status = "Inactive";
    }
    discount.updated_at = Date.now();
    await discount.save();
    console.log("Discount usage increased");
    return discount;
  } catch (error) {
    console.error("Error incrementing discount usage:", error.message);
    throw error;
  }
};

/**
 * @function updateDiscountStatuses
 * @desc Updates the status of active discounts that have expired to "Inactive".
 * @access Public
 * @throws {Error} If no active discounts are found or if there is an issue updating statuses.
 * @returns {Void}
 *
 * This function checks all active discounts and updates their status to "Inactive" if the current date is greater than the `end_date`.
 * The function handles multiple discounts and ensures statuses are updated as necessary.
 */
const updateDiscountStatuses = async () => {
  try {
    const discounts = await Discount.find({ status: "Active" });
    if (discounts.length === 0) {
      throw new Error("Discounts not found");
    }
    const update = discounts
      .map((discount) => {
        if (Date.now() > discount.end_date) {
          discount.status = "Inactive";
          discount.updated_at = Date.now();
          return discount.save();
        }
      })
      .filter(Boolean);
    await Promise.all(update);
    console.log(
      `Checked and updated discount statuses for ${discounts.length} discounts`
    );
  } catch (error) {
    console.error("Error updating discount statuses:", error.message);
  }
};

/**
 * @function checkDiscountActiveOrInactive
 * @desc Checks if a discount is active or inactive.
 * @param {String} discountId - The unique identifier of the discount.
 * @throws {Error} If the discount is not found or is inactive, returns an error.
 * @returns {Void}
 *
 * This function checks if the given discount is active or inactive. If the discount is inactive, an error is thrown. If it is found to be
 * active, no action is taken.
 */
const checkDiscountActiveOrInactive = async (discountId) => {
  try {
    const discount = await Discount.findById(discountId);
    if (!discount) {
      throw new Error("Discount not found");
    }
    if (discount.status === "Inactive") {
      throw new Error("Discount is expired and cannot be used");
    }
  } catch (error) {
    console.error("Error checking discount status:", error.message);
    throw error;
  }
};

module.exports = {
  getDiscounts,
  getDiscount,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  incrementDiscountUsage,
  updateDiscountStatuses,
  checkDiscountActiveOrInactive,
};
