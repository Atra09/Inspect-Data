const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const logAktivitas = db.define(
  "log_aktivitas",
  {
    id_log: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nama_user: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aksi: {
      type: DataTypes.STRING, // CREATE, UPDATE, DELETE, LOGIN, LOGOUT, INSPEKSI, VERIFIKASI
      allowNull: false,
    },
    entitas: {
      type: DataTypes.STRING, // User, Kapal, Manifest, Penumpang, Nahkoda, Agen, Pelabuhan, Auth
      allowNull: false,
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "log_aktivitas",
    timestamps: true,
  }
);

module.exports = logAktivitas;
