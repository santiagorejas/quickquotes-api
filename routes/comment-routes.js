const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/check-auth");
const commentController = require("../controllers/comment-controller");

router.post("/", checkAuth, commentController.createComment);

module.exports = router;
