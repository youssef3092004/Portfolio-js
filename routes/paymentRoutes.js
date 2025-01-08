const {checkout} = require("../controllers/paymentController");

const Router = require("express");

const router = Router()

router.post("/checkout", checkout);

module.exports = router;
