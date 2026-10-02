const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/jwt");
const { adminAuth } = require("../middleware/authorization");
const {
  getLogAktivitas,
  clearLogAktivitas,
} = require("../controller/logAktivitasController");

router.use(verifyToken);

router.get("/", getLogAktivitas);
router.delete("/clear", adminAuth, clearLogAktivitas);

module.exports = router;
