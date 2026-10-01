const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ msg: "tidak ada akses" });

    const secretKey = process.env.JWT_SECRET || "caloKapalmogaadabayaran";
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) return res.status(401).json({ msg: "invalid / expired token" });
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Terjadi kesalahan pada fungsi jwt" });
  }
};

module.exports = verifyToken;
