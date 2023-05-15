const express = require("express");
const DataController = require("../controllers/data");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// Data
router.post("/create", checkAuth, DataController.createData);
router.put("/update/:id", checkAuth, DataController.updateData);
router.get("/get", checkAuth, DataController.getData);
router.get("/getbyid/:id", checkAuth, DataController.getById);
router.delete("/delete/:id", checkAuth, DataController.deleteData);

module.exports = router;
