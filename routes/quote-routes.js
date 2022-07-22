const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/check-auth");
const quoteController = require("../controllers/quote-controller");

router.post("/", checkAuth, quoteController.createQuote);

router.get("/", quoteController.getQuotes);

router.get("/favorites", checkAuth, quoteController.getLikedQuotes);

router.get("/favorites-id", checkAuth, quoteController.getLikedQuotesId);

router.get("/:qid", quoteController.getQuoteDetail);

router.get("/user/:nickname", quoteController.getQuotesByUserNickname);

router.patch("/:qid", checkAuth, quoteController.updateQuote);

router.delete("/:qid", checkAuth, quoteController.deleteQuote);

module.exports = router;
