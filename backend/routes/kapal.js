var express = require("express");
var router = express.Router();
const verifyToken = require("../middleware/jwt");
const {
  getKapal,
  getKapalById,
  storeKapal,
  updateKapal,
  deleteKapal,
  getJenis,
  storeJenis,
  updateJenis,
  deleteJenis,
  getAsal,
  storeAsal,
  updateAsal,
  deleteAsal,
} = require("../controller/kapalController");

router.use(verifyToken);

// 1. Jenis Kapal Routes (Static Routes FIRST)
router.get("/jenis/all", getJenis);
router.post("/jenis/store", storeJenis);
router.patch("/jenis/update/:id", updateJenis);
router.delete("/jenis/delete/:id", deleteJenis);

// 2. Asal / Kedudukan Kapal Routes (Static Routes FIRST)
router.get("/asal/all", getAsal);
router.post("/asal/store", storeAsal);
router.patch("/asal/update/:id", updateAsal);
router.delete("/asal/delete/:id", deleteAsal);

// 3. Main Kapal Routes
router.get("/all", getKapal);
router.get("/", getKapal);
router.post("/store", storeKapal);
router.patch("/update/:id", updateKapal);
router.delete("/delete/:id", deleteKapal);

// 4. Parameterized ID Route LAST (Prevents collision with static routes like /jenis/all)
router.get("/:id", getKapalById);

module.exports = router;
