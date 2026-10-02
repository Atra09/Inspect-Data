const { nahkoda, manifest } = require("../model/association");
const { Op } = require("sequelize");
const { createLog } = require("../utils/logHelper");

const getNahkoda = async (req, res) => {
  let search = (req.query.search || "").trim();
  try {
    const whereClause = search
      ? {
          nama_nahkoda: { [Op.like]: `%${search}%` },
        }
      : {};

    const datas = await nahkoda.findAll({
      order: [["id_nahkoda", "DESC"]],
      where: whereClause,
    });
    return res.status(200).json({ msg: "Berhasil mengambil data", datas });
  } catch (error) {
    console.error("getNahkoda Error:", error);
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const getNahkodaById = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await nahkoda.findByPk(id);
    if (!data) return res.status(404).json({ msg: "Data tidak ditemukan" });

    return res.status(200).json({ msg: "Berhasil mengambil data", data });
  } catch (error) {
    console.error("getNahkodaById Error:", error);
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const storeNahkoda = async (req, res) => {
  try {
    const { nama_nahkoda } = req.body;
    if (!nama_nahkoda || !nama_nahkoda.trim()) {
      return res.status(400).json({ msg: "Nama nahkoda wajib diisi" });
    }

    const newNahkoda = await nahkoda.create({ nama_nahkoda: nama_nahkoda.trim() });
    await createLog(req, "CREATE", "Nahkoda", `Menambahkan master nahkoda baru: '${newNahkoda.nama_nahkoda}'`);
    return res.status(200).json({ msg: "Berhasil menambahkan data nahkoda", data: newNahkoda });
  } catch (error) {
    console.error("storeNahkoda Error:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ msg: "Nama nahkoda sudah terdaftar" });
    }
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const updateNahkoda = async (req, res) => {
  try {
    const id = req.params.id;
    const { nama_nahkoda } = req.body;
    if (!nama_nahkoda || !nama_nahkoda.trim()) {
      return res.status(400).json({ msg: "Nama nahkoda wajib diisi" });
    }

    const [updatedCount] = await nahkoda.update(
      { nama_nahkoda: nama_nahkoda.trim() },
      { where: { id_nahkoda: id } }
    );

    if (updatedCount === 0) return res.status(404).json({ msg: "Data tidak ditemukan" });

    await createLog(req, "UPDATE", "Nahkoda", `Memperbarui data nahkoda ID: ${id} ('${nama_nahkoda.trim()}')`);
    return res.status(200).json({ msg: "Berhasil memperbarui data nahkoda" });
  } catch (error) {
    console.error("updateNahkoda Error:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ msg: "Nama nahkoda sudah terdaftar" });
    }
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const deleteNahkoda = async (req, res) => {
  try {
    const id = req.params.id;
    const nahkodaData = await nahkoda.findByPk(id);

    if (!nahkodaData) return res.status(404).json({ msg: "Data nahkoda tidak ditemukan" });

    // Cek proteksi relasi dengan tabel manifest
    const countManifest = await manifest.count({ where: { id_nahkoda: id } });
    if (countManifest > 0) {
      return res.status(400).json({
        msg: `Data nahkoda '${nahkodaData.nama_nahkoda}' tidak dapat dihapus karena sedang digunakan dalam ${countManifest} data manifest pelayaran.`,
      });
    }

    await nahkoda.destroy({ where: { id_nahkoda: id } });
    await createLog(req, "DELETE", "Nahkoda", `Menghapus data nahkoda: '${nahkodaData.nama_nahkoda}' (ID: ${id})`);
    return res.status(200).json({ msg: "Berhasil menghapus data nahkoda" });
  } catch (error) {
    console.error("deleteNahkoda Error:", error);
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

module.exports = { getNahkoda, getNahkodaById, storeNahkoda, updateNahkoda, deleteNahkoda };
