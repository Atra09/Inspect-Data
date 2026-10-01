const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/jwt");
const { getKabupaten, storeKabupaten, updateKabupaten, deleteKabupaten } = require("../controller/kabupatenController");

router.use(verifyToken);
router.get("/all", getKabupaten);
router.get("/", getKabupaten);
router.post("/store", storeKabupaten);
router.patch("/update/:id", updateKabupaten);
router.delete("/delete/:id", deleteKabupaten);

module.exports = router;
