const { logAktivitas, users } = require("../model/association");
const { Op } = require("sequelize");

const getLogAktivitas = async (req, res) => {
  try {
    const search = (req.query.search || "").trim();
    const aksi = (req.query.aksi || "").trim();
    const entitas = (req.query.entitas || "").trim();

    const whereClause = {};

    if (aksi && aksi !== "All") {
      whereClause.aksi = aksi;
    }

    if (entitas && entitas !== "All") {
      whereClause.entitas = entitas;
    }

    if (search) {
      whereClause[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { nama_user: { [Op.like]: `%${search}%` } },
        { keterangan: { [Op.like]: `%${search}%` } },
        { entitas: { [Op.like]: `%${search}%` } },
        { ip_address: { [Op.like]: `%${search}%` } },
      ];
    }

    const rawDatas = await logAktivitas.findAll({
      where: whereClause,
      order: [["id_log", "DESC"]],
      include: [
        {
          model: users,
          as: "user",
          attributes: ["id_user", "username", "nama_lengkap", "role", "foto"],
        },
      ],
      limit: 500, // Limit to 500 latest entries for performance
    });

    // Summary counts
    const total = rawDatas.length;
    const countCreate = rawDatas.filter((l) => l.aksi === "CREATE").length;
    const countUpdate = rawDatas.filter((l) => l.aksi === "UPDATE").length;
    const countDelete = rawDatas.filter((l) => l.aksi === "DELETE").length;
    const countLogin = rawDatas.filter((l) => l.aksi === "LOGIN").length;

    return res.status(200).json({
      status: true,
      msg: "Berhasil mengambil log aktivitas",
      summary: {
        total,
        create: countCreate,
        update: countUpdate,
        delete: countDelete,
        login: countLogin,
      },
      datas: rawDatas,
      data: rawDatas,
    });
  } catch (error) {
    console.error("Error getLogAktivitas:", error);
    try {
      // If table doesn't exist yet, auto-create it and return empty list
      await logAktivitas.sync();
      return res.status(200).json({
        status: true,
        msg: "Berhasil inisialisasi tabel log aktivitas",
        summary: { total: 0, create: 0, update: 0, delete: 0, login: 0 },
        datas: [],
        data: [],
      });
    } catch (syncErr) {
      return res.status(500).json({
        status: false,
        msg: "Terjadi kesalahan server saat mengambil log aktivitas: " + error.message,
      });
    }
  }
};

const clearLogAktivitas = async (req, res) => {
  try {
    await logAktivitas.destroy({ where: {}, truncate: false });
    return res.status(200).json({
      status: true,
      msg: "Berhasil membersihkan seluruh log aktivitas",
    });
  } catch (error) {
    console.error("Error clearLogAktivitas:", error);
    return res.status(500).json({
      status: false,
      msg: "Gagal membersihkan log aktivitas: " + error.message,
    });
  }
};

module.exports = {
  getLogAktivitas,
  clearLogAktivitas,
};
