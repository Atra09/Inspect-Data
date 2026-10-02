const logAktivitas = require("../model/logAktivitasModel");

/**
 * Safely create a user activity log entry
 * @param {Object} req - Express Request object (contains req.user from JWT & req.ip) or user context
 * @param {string} aksi - CREATE, UPDATE, DELETE, LOGIN, LOGOUT, INSPEKSI, VERIFIKASI
 * @param {string} entitas - User, Kapal, Manifest, Penumpang, Nahkoda, Agen, Pelabuhan, Auth, etc.
 * @param {string} keterangan - Detailed description of the user activity
 */
const createLog = async (req, aksi, entitas, keterangan) => {
  try {
    // Extract user info safely from multiple possible locations
    let user = {};
    if (req?.user) {
      user = req.user;
    } else if (req?.id_user || req?.username) {
      user = req;
    } else if (req?.body?.user) {
      user = req.body.user;
    }

    const userId = user.id_user || user.id || null;
    const username = user.username || 'system';
    const namaUser = user.nama_lengkap || user.nama_user || user.username || 'System';
    const role = user.role || 'user';

    const ip =
      req?.headers?.["x-forwarded-for"] ||
      req?.socket?.remoteAddress ||
      req?.ip ||
      "127.0.0.1";

    const newLog = await logAktivitas.create({
      id_user: userId,
      username: String(username),
      nama_user: String(namaUser),
      role: String(role),
      aksi: String(aksi).toUpperCase(),
      entitas: String(entitas),
      keterangan: String(keterangan),
      ip_address: String(ip),
    });

    console.log(`🟢 Activity Log Saved [${aksi}] ${entitas}: ${keterangan} (Log ID: ${newLog.id_log})`);
    return newLog;
  } catch (error) {
    console.error("❌ Failed to create activity log:", error);
  }
};

module.exports = { createLog };
