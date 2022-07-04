const express = require("express");
const router = express.Router();

const userController = require("../controllers/user-controller");

router.post("/auth/signup", userController.singup);

router.post("/auth/login", userController.login);

module.exports = router;
