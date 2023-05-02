const express = require("express");
const AturanPenilaianController = require("../controllers/aturan_penilaian");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// AturanPenilaian
router.post(
  "/create",
  checkAuth,
  AturanPenilaianController.createAturanPenilaian
);
router.put(
  "/update/:id",
  checkAuth,
  AturanPenilaianController.updateAturanPenilaian
);
router.get("/get", checkAuth, AturanPenilaianController.getAturanPenilaian);
router.delete(
  "/delete/:id",
  checkAuth,
  AturanPenilaianController.deleteAturanPenilaian
);

module.exports = router;
