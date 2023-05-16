const express = require("express");
const UserController = require("../controllers/user");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// User
router.post("/login", UserController.userLogin);
router.post("/forgetpassword", UserController.forgetPassword);
router.get("/verifyresetpassword/:token", UserController.VerifyResetPassword);
router.post("/resetpassword", UserController.resetpassword);
router.post("/update", checkAuth, UserController.updateUser);

module.exports = router;
