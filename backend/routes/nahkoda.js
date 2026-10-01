const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/jwt");
const {
  getNahkoda,
  getNahkodaById,
  storeNahkoda,
  updateNahkoda,
  deleteNahkoda,
} = require("../controller/nahkodaController");

router.use(verifyToken);

router.get("/all", getNahkoda);
router.get("/", getNahkoda);
router.post("/store", storeNahkoda);
router.patch("/update/:id", updateNahkoda);
router.delete("/delete/:id", deleteNahkoda);
router.get("/:id", getNahkodaById);

module.exports = router;
