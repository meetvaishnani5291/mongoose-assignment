const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth");

router.post("/login", userController.loginUser);

router.get("/", auth, userController.getUser);

router.post("/", userController.addUser);

router.delete("/", auth, userController.deleteUser);

module.exports = router;
