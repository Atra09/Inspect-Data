const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/jwt");
const {
  getSpbAsal,
  getSpbAsalById,
  storeSpbAsal,
  updateSpbAsal,
  deleteSpbAsal,
} = require("../controller/spbAsalController");

router.use(verifyToken);

router.get("/all", getSpbAsal);
router.get("/", getSpbAsal);
router.post("/store", storeSpbAsal);
router.patch("/update/:id", updateSpbAsal);
router.delete("/delete/:id", deleteSpbAsal);
router.get("/:id", getSpbAsalById);

module.exports = router;
