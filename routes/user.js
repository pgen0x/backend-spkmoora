const express = require("express");
const UserController = require("../controllers/user");

const router = express.Router();

// User
router.post("/login", UserController.userLogin);
router.post("/forgetpassword", UserController.forgetPassword);
router.get("/verifyresetpassword/:token", UserController.VerifyResetPassword);
router.post("/resetpassword", UserController.resetpassword);

module.exports = router;
