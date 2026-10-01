const fs = require("fs");
const path = require("path");
const { manifest, kapal, nahkoda, agen, pelabuhan, spb, penumpang } = require("../model/association");
const { Op } = require("sequelize");

const formatManifestItem = (m) => {
  const plain = m.get ? m.get({ plain: true }) : m;
  const pList = plain.penumpang_list || plain.penumpang || [];
  const totalPassengers = pList.length;
  const countPending = pList.filter((p) => p.status_verifikasi === "pending").length;
  const countSelesai = pList.filter((p) => p.status_verifikasi === "selesai").length;

  let status_inspeksi = "-";
  if (totalPassengers > 0) {
    status_inspeksi = countPending > 0 ? "pending" : "selesai";
  }

  return {
    ...plain,
    no_spb: plain.spb?.no_spb || plain.no_spb || "",
    no_spb_asal: plain.spb?.no_spb_asal || plain.no_spb_asal || "",
    total_penumpang: totalPassengers,
    count_pending: countPending,
    count_selesai: countSelesai,
    status_inspeksi,
  };
};

const getManifest = async (req, res) => {
  try {
    const search = (req.query.search || "").trim();
    const whereClause = search
      ? {
          [Op.or]: [
            { no_urut: { [Op.like]: `%${search}%` } },
            { status_pelayaran: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const rawDatas = await manifest.findAll({
      order: [["id_manifest", "DESC"]],
      where: whereClause,
      include: [
        { model: kapal, as: "kapal" },
        { model: nahkoda, as: "nahkoda" },
        { model: agen, as: "agen" },
        { model: spb, as: "spb" },
        { model: pelabuhan, as: "pelabuhan_asal" },
        { model: pelabuhan, as: "pelabuhan_sandar" },
        { model: pelabuhan, as: "pelabuhan_tolak" },
        { model: pelabuhan, as: "pelabuhan_tujuan" },
        { model: pelabuhan, as: "pelabuhan_singgah" },
        { model: penumpang, as: "penumpang_list" },
      ],
    });

    const datas = rawDatas.map(formatManifestItem);
    return res.status(200).json({ msg: "Berhasil mengambil data manifest", datas });
  } catch (error) {
    console.error("getManifest Error:", error);
    return res.status(500).json({ msg: "Terjadi kesalahan pada server saat mengambil manifest" });
  }
};

const getManifestById = async (req, res) => {
  try {
    const { id } = req.params;
    const rawData = await manifest.findByPk(id, {
      include: [
        { model: kapal, as: "kapal" },
        { model: nahkoda, as: "nahkoda" },
        { model: agen, as: "agen" },
        { model: spb, as: "spb" },
        { model: pelabuhan, as: "pelabuhan_asal" },
        { model: pelabuhan, as: "pelabuhan_sandar" },
        { model: pelabuhan, as: "pelabuhan_tolak" },
        { model: pelabuhan, as: "pelabuhan_tujuan" },
        { model: pelabuhan, as: "pelabuhan_singgah" },
        { model: penumpang, as: "penumpang_list" },
      ],
    });
    if (!rawData) return res.status(404).json({ msg: "Data manifest tidak ditemukan" });

    const data = formatManifestItem(rawData);
    return res.status(200).json({ msg: "Berhasil mengambil detail manifest", data });
  } catch (error) {
    console.error("getManifestById Error:", error);
    return res.status(500).json({ msg: "Terjadi kesalahan saat mengambil detail manifest" });
  }
};

const storeManifest = async (req, res) => {
  try {
    const body = { ...req.body };
    const { no_spb, no_spb_asal } = body;

    // Handle SPB creation
    if (no_spb || no_spb_asal) {
      const spbRecord = await spb.create({
        no_spb: no_spb ? String(no_spb).trim() : null,
        no_spb_asal: no_spb_asal ? String(no_spb_asal).trim() : null,
      });
      body.id_spb = spbRecord.id_spb;
    }

    const newManifest = await manifest.create(body);
    return res.status(200).json({ msg: "Berhasil menambahkan data manifest", data: newManifest });
  } catch (error) {
    console.error("storeManifest Error:", error);
    return res.status(500).json({ msg: error.message || "Gagal menyimpan data manifest" });
  }
};

const updateManifest = async (req, res) => {
  try {
    const { id } = req.params;
    const target = await manifest.findByPk(id);
    if (!target) return res.status(404).json({ msg: "Data manifest tidak ditemukan" });

    const body = { ...req.body };
    const { no_spb, no_spb_asal } = body;

    if (no_spb !== undefined || no_spb_asal !== undefined) {
      if (target.id_spb) {
        await spb.update(
          {
            no_spb: no_spb ? String(no_spb).trim() : undefined,
            no_spb_asal: no_spb_asal ? String(no_spb_asal).trim() : undefined,
          },
          { where: { id_spb: target.id_spb } }
        );
      } else {
        const newSpb = await spb.create({
          no_spb: no_spb ? String(no_spb).trim() : null,
          no_spb_asal: no_spb_asal ? String(no_spb_asal).trim() : null,
        });
        body.id_spb = newSpb.id_spb;
      }
    }

    await manifest.update(body, { where: { id_manifest: id } });
    return res.status(200).json({ msg: "Berhasil memperbarui data manifest" });
  } catch (error) {
    console.error("updateManifest Error:", error);
    return res.status(500).json({ msg: error.message || "Gagal memperbarui data manifest" });
  }
};

const deleteManifest = async (req, res) => {
  try {
    const { id } = req.params;
    const target = await manifest.findByPk(id);
    if (!target) return res.status(404).json({ msg: "Data manifest tidak ditemukan" });

    // 1. Ambil seluruh data penumpang yang terikat ke manifest ini
    const listPenumpang = await penumpang.findAll({ where: { id_manifest: id } });

    // 2. Hapus file fisik foto KTP penumpang dari folder backend/public/images/inspeksi/ jika ada
    for (const p of listPenumpang) {
      if (p.foto_ktp) {
        const relativePath = p.foto_ktp.startsWith('/') ? p.foto_ktp.slice(1) : p.foto_ktp;
        const fullPath = path.join(__dirname, '..', 'public', relativePath);
        if (fs.existsSync(fullPath)) {
          try {
            fs.unlinkSync(fullPath);
            console.log(`[DELETE MANIFEST] Deleted passenger photo: ${fullPath}`);
          } catch (fileErr) {
            console.error(`[DELETE MANIFEST] Failed to delete photo ${fullPath}:`, fileErr);
          }
        }
      }
    }

    // 3. Hapus seluruh data penumpang di database
    await penumpang.destroy({ where: { id_manifest: id } });

    // 4. Hapus data SPB jika terikat
    if (target.id_spb) {
      await spb.destroy({ where: { id_spb: target.id_spb } });
    }

    // 5. Hapus data manifest
    await manifest.destroy({ where: { id_manifest: id } });
    return res.status(200).json({ msg: "Berhasil menghapus data manifest beserta seluruh data penumpang & foto terkait" });
  } catch (error) {
    console.error("deleteManifest Error:", error);
    return res.status(500).json({ msg: "Gagal menghapus data manifest" });
  }
};

module.exports = {
  getManifest,
  getManifestById,
  storeManifest,
  updateManifest,
  deleteManifest,
};
