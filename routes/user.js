const express = require("express");
const UserController = require("../controllers/user");

const router = express.Router();

// User
router.post("/login", UserController.userLogin);

module.exports = router;
