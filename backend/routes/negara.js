const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/jwt");
const { getNegara, storeNegara, updateNegara, deleteNegara } = require("../controller/negaraController");

router.use(verifyToken);
router.get("/all", getNegara);
router.get("/", getNegara);
router.post("/store", storeNegara);
router.patch("/update/:id", updateNegara);
router.delete("/delete/:id", deleteNegara);

module.exports = router;
