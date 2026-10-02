const fs = require("fs");
const path = require("path");
const penumpang = require("../model/penumpangModel");
const manifest = require("../model/manifestModel");
const { createLog } = require("../utils/logHelper");

// Helper to safely normalize gender strings without truncation errors
const normalizeJenisKelamin = (val) => {
  if (!val) return null;
  const str = String(val).trim().toUpperCase();
  if (str.includes("LAK") || str === "L" || str === "MALE") return "L";
  if (str.includes("PEREM") || str === "P" || str === "FEMALE") return "P";
  return str.slice(0, 20);
};

// Upload KTP image to public/images/inspeksi/ formatted DD-MM-YY and immediately insert penumpang DB record
const uploadScanPenumpang = async (req, res) => {
  try {
    const { id_manifest, foto_base64, nik, nama_penumpang, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat } = req.body;

    if (!id_manifest) {
      return res.status(400).json({ status: false, message: "id_manifest wajib diisi" });
    }

    let foto_ktp_path = null;

    if (foto_base64) {
      const dir = path.join(__dirname, "..", "public", "images", "inspeksi");
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Date format: DD-MM-YY (e.g. 30-09-26)
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yy = String(now.getFullYear()).slice(-2);
      const datePrefix = `${dd}-${mm}-${yy}`;
      const timestamp = Date.now();
      const random = Math.floor(1000 + Math.random() * 9000);
      const fileName = `${datePrefix}-${timestamp}-${random}.jpg`;
      const fullFilePath = path.join(dir, fileName);

      // Extract base64 image data
      const base64Data = foto_base64.replace(/^data:image\/\w+;base64,/, "");
      fs.writeFileSync(fullFilePath, Buffer.from(base64Data, "base64"));

      foto_ktp_path = `/images/inspeksi/${fileName}`;
    }

    // Immediately insert into penumpang table in database with status 'pending'
    const newRecord = await penumpang.create({
      id_manifest,
      nik: nik ? String(nik).trim() : null,
      nama_penumpang: nama_penumpang ? String(nama_penumpang).trim() : null,
      tempat_lahir: tempat_lahir ? String(tempat_lahir).trim() : null,
      tanggal_lahir: tanggal_lahir || null,
      jenis_kelamin: normalizeJenisKelamin(jenis_kelamin),
      alamat: alamat ? String(alamat).trim() : null,
      foto_ktp: foto_ktp_path,
      tipe_penumpang: "naik",
      status_verifikasi: "pending",
    });

    await createLog(
      req,
      "INSPEKSI",
      "Penumpang",
      `Pemindaian KTP & Registrasi Inspeksi: "${newRecord.nama_penumpang || "Tanpa Nama"}" (NIK: ${newRecord.nik || "-"})`
    );

    return res.status(201).json({
      status: true,
      message: "Berhasil menyimpan foto scan & data penumpang ke database",
      data: newRecord,
    });
  } catch (error) {
    console.error("Error uploadScanPenumpang:", error);
    return res.status(500).json({
      status: false,
      message: "Gagal menyimpan upload scan penumpang: " + error.message,
    });
  }
};

// Get all passengers by id_manifest with summary count
const getPenumpangByManifest = async (req, res) => {
  try {
    const { id_manifest } = req.params;
    const list = await penumpang.findAll({
      where: { id_manifest },
      order: [["id_penumpang", "ASC"]],
    });

    const total = list.length;
    const countPending = list.filter((p) => p.status_verifikasi === "pending").length;
    const countSelesai = list.filter((p) => p.status_verifikasi === "selesai").length;

    return res.status(200).json({
      status: true,
      message: "Berhasil mengambil data penumpang",
      summary: {
        total,
        pending: countPending,
        selesai: countSelesai,
      },
      data: list,
    });
  } catch (error) {
    console.error("Error getPenumpangByManifest:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan server: " + error.message,
    });
  }
};

// Get single passenger detail
const getPenumpangById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await penumpang.findByPk(id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Data penumpang tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: true,
      data,
    });
  } catch (error) {
    console.error("Error getPenumpangById:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan server: " + error.message,
    });
  }
};

// Create new passenger record (from AI Scan or Manual Entry)
const createPenumpang = async (req, res) => {
  try {
    const {
      id_manifest,
      nik,
      nama_penumpang,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      alamat,
      foto_ktp,
      tipe_penumpang,
      status_verifikasi,
    } = req.body;

    if (!id_manifest) {
      return res.status(400).json({
        status: false,
        message: "id_manifest wajib diisi",
      });
    }

    const newPenumpang = await penumpang.create({
      id_manifest,
      nik: nik ? String(nik).trim() : null,
      nama_penumpang: nama_penumpang ? String(nama_penumpang).trim() : null,
      tempat_lahir: tempat_lahir ? String(tempat_lahir).trim() : null,
      tanggal_lahir: tanggal_lahir || null,
      jenis_kelamin: normalizeJenisKelamin(jenis_kelamin),
      alamat: alamat ? String(alamat).trim() : null,
      foto_ktp: foto_ktp || null,
      tipe_penumpang: tipe_penumpang || "naik",
      status_verifikasi: status_verifikasi || "pending",
    });

    await createLog(
      req,
      "CREATE",
      "Penumpang",
      `Menambahkan data penumpang baru: "${newPenumpang.nama_penumpang || "Tanpa Nama"}" (NIK: ${newPenumpang.nik || "-"})`
    );

    return res.status(201).json({
      status: true,
      message: "Berhasil menambahkan data penumpang",
      data: newPenumpang,
    });
  } catch (error) {
    console.error("Error createPenumpang:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan server: " + error.message,
    });
  }
};

// Update passenger data & status_verifikasi ('pending' -> 'selesai')
const updatePenumpang = async (req, res) => {
  try {
    const { id } = req.params;
    const target = await penumpang.findByPk(id);

    if (!target) {
      return res.status(404).json({
        status: false,
        message: "Data penumpang tidak ditemukan",
      });
    }

    const {
      nik,
      nama_penumpang,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      alamat,
      foto_ktp,
      tipe_penumpang,
      status_verifikasi,
    } = req.body;

    await target.update({
      nik: nik !== undefined ? (nik ? String(nik).trim() : null) : target.nik,
      nama_penumpang: nama_penumpang !== undefined ? (nama_penumpang ? String(nama_penumpang).trim() : null) : target.nama_penumpang,
      tempat_lahir: tempat_lahir !== undefined ? (tempat_lahir ? String(tempat_lahir).trim() : null) : target.tempat_lahir,
      tanggal_lahir: tanggal_lahir !== undefined ? (tanggal_lahir || null) : target.tanggal_lahir,
      jenis_kelamin: jenis_kelamin !== undefined ? normalizeJenisKelamin(jenis_kelamin) : target.jenis_kelamin,
      alamat: alamat !== undefined ? (alamat ? String(alamat).trim() : null) : target.alamat,
      foto_ktp: foto_ktp !== undefined ? foto_ktp : target.foto_ktp,
      tipe_penumpang: tipe_penumpang !== undefined ? tipe_penumpang : target.tipe_penumpang,
      status_verifikasi: status_verifikasi !== undefined ? status_verifikasi : target.status_verifikasi,
    });

    const aksi = status_verifikasi === "selesai" ? "VERIFIKASI" : "UPDATE";
    await createLog(
      req,
      aksi,
      "Penumpang",
      `Mengubah data/status penumpang "${target.nama_penumpang || "Tanpa Nama"}" (ID: ${id}, Status: ${target.status_verifikasi})`
    );

    return res.status(200).json({
      status: true,
      message: "Berhasil mengupdate data penumpang",
      data: target,
    });
  } catch (error) {
    console.error("Error updatePenumpang:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan server: " + error.message,
    });
  }
};

// Delete passenger record
const deletePenumpang = async (req, res) => {
  try {
    const { id } = req.params;
    const target = await penumpang.findByPk(id);

    if (!target) {
      return res.status(404).json({
        status: false,
        message: "Data penumpang tidak ditemukan",
      });
    }

    await target.destroy();

    await createLog(
      req,
      "DELETE",
      "Penumpang",
      `Menghapus data penumpang "${target.nama_penumpang || "Tanpa Nama"}" (ID: ${id})`
    );

    return res.status(200).json({
      status: true,
      message: "Berhasil menghapus data penumpang",
    });
  } catch (error) {
    console.error("Error deletePenumpang:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan server: " + error.message,
    });
  }
};

module.exports = {
  uploadScanPenumpang,
  getPenumpangByManifest,
  getPenumpangById,
  createPenumpang,
  updatePenumpang,
  deletePenumpang,
};
