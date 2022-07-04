const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/check-auth");
const likeController = require("../controllers/like-controller");

router.post("/:qid", checkAuth, likeController.likeQuote);

module.exports = router;
