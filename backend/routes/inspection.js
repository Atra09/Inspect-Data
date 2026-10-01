const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  console.log('Inspeksi diterima:', req.body);
  return res.json({
    success: true,
    message: 'Data Inspeksi Berhasil Disimpan',
    id: Date.now()
  });
});

module.exports = router;
