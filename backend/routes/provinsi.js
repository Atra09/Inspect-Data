const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/jwt");
const { getProvinsi, storeProvinsi, updateProvinsi, deleteProvinsi } = require("../controller/provinsiController");

router.use(verifyToken);
router.get("/all", getProvinsi);
router.get("/", getProvinsi);
router.post("/store", storeProvinsi);
router.patch("/update/:id", updateProvinsi);
router.delete("/delete/:id", deleteProvinsi);

module.exports = router;
