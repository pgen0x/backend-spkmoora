const express = require("express");
const JenisKendaraanController = require("../controllers/jenis_kendaraan");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// JenisKendaraan
router.post(
  "/create",
  checkAuth,
  JenisKendaraanController.createJenisKendaraan
);
router.put(
  "/update/:id",
  checkAuth,
  JenisKendaraanController.updateJenisKendaraan
);
router.get("/get", checkAuth, JenisKendaraanController.getJenisKendaraan);
router.get("/getbyid/:id", checkAuth, JenisKendaraanController.getById);
router.delete(
  "/delete/:id",
  checkAuth,
  JenisKendaraanController.deleteJenisKendaraan
);

module.exports = router;
