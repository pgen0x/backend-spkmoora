const express = require("express");
const BobotKriteriaController = require("../controllers/bobot_kriteria");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// BobotKriteria
router.post("/create", checkAuth, BobotKriteriaController.createBobotKriteria);
router.put(
  "/update/:id",
  checkAuth,
  BobotKriteriaController.updateBobotKriteria
);
router.get("/get", checkAuth, BobotKriteriaController.getBobotKriteria);
router.get("/getbyid/:id", checkAuth, BobotKriteriaController.getById);
router.delete(
  "/delete/:id",
  checkAuth,
  BobotKriteriaController.deleteBobotKriteria
);

module.exports = router;
