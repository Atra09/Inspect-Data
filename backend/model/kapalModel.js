const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const kapal = db.define(
  "kapal",
  {
    id_kapal: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_kapal: DataTypes.STRING,
    id_jenis: DataTypes.INTEGER,
    id_bendera: DataTypes.INTEGER,
    gt: DataTypes.INTEGER,
    nt: DataTypes.INTEGER,
    nomor_selar: DataTypes.INTEGER,
    tanda_selar: DataTypes.STRING,
    nomor_imo: DataTypes.STRING,
    call_sign: DataTypes.STRING,
    id_asal_kapal: DataTypes.INTEGER,
  },
  {
    tableName: "kapal",
    timestamps: true,
  }
);

module.exports = kapal;
