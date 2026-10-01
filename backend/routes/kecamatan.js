const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/jwt");
const { getKecamatan, storeKecamatan, updateKecamatan, deleteKecamatan } = require("../controller/kecamatanController");

router.use(verifyToken);
router.get("/all", getKecamatan);
router.get("/", getKecamatan);
router.post("/store", storeKecamatan);
router.patch("/update/:id", updateKecamatan);
router.delete("/delete/:id", deleteKecamatan);

module.exports = router;
