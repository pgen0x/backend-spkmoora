const express = require("express");
const KriteriaPenilaianController = require("../controllers/kriteria_penilaian");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// KriteriaPenilaian
router.post(
  "/create",
  checkAuth,
  KriteriaPenilaianController.createKriteriaPenilaian
);
router.put(
  "/update/:id",
  checkAuth,
  KriteriaPenilaianController.updateKriteriaPenilaian
);
router.get("/get", checkAuth, KriteriaPenilaianController.getKriteriaPenilaian);
router.delete(
  "/delete/:id",
  checkAuth,
  KriteriaPenilaianController.deleteKriteriaPenilaian
);

module.exports = router;
