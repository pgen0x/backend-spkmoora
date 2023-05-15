const express = require("express");
const PerhitunganController = require("../controllers/perhitungan");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// Perhitungan
router.post("/hitung", checkAuth, PerhitunganController.Hitung);
router.post("/simpan/", checkAuth, PerhitunganController.Simpan);
router.get("/get", checkAuth, PerhitunganController.getData);
router.get("/getbyid/:id", checkAuth, PerhitunganController.getById);
// router.delete("/delete/:id", checkAuth, PerhitunganController.deleteData);

module.exports = router;
