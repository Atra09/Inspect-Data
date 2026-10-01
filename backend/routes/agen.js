const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/jwt");
const {
  getAgen,
  getAgenById,
  storeAgen,
  updateAgen,
  deleteAgen,
} = require("../controller/agenController");

router.use(verifyToken);

router.get("/all", getAgen);
router.get("/", getAgen);
router.post("/store", storeAgen);
router.patch("/update/:id", updateAgen);
router.delete("/delete/:id", deleteAgen);
router.get("/:id", getAgenById);

module.exports = router;
