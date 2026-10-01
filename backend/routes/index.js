const express = require('express');
const router = express.Router();

/* GET home page / API status. */
router.get('/', function(req, res, next) {
  res.json({
    success: true,
    message: 'KSOP CaloKapal API Service Running',
    version: '1.0.0'
  });
});

module.exports = router;
