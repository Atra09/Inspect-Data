const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/jwt");
const {
  getPelabuhan,
  getPelabuhanById,
  storePelabuhan,
  updatePelabuhan,
  deletePelabuhan,
} = require("../controller/pelabuhanController");

router.use(verifyToken);

router.get("/all", getPelabuhan);
router.get("/", getPelabuhan);
router.post("/store", storePelabuhan);
router.patch("/update/:id", updatePelabuhan);
router.delete("/delete/:id", deletePelabuhan);
router.get("/:id", getPelabuhanById);

module.exports = router;
