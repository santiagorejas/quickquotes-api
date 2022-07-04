const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/check-auth");
const quoteController = require("../controllers/quote-controller");

router.post("/", checkAuth, quoteController.createQuote);

router.get("/", quoteController.getQuotes);

module.exports = router;
