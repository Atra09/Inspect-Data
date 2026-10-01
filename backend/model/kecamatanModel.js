const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const kecamatan = db.define(
  "kecamatan",
  {
    id_kecamatan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_kecamatan: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    id_kabupaten: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "kecamatan",
    timestamps: true,
  }
);

module.exports = kecamatan;
