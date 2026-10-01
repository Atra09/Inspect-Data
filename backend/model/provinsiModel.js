const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const provinsi = db.define(
  "provinsi",
  {
    id_provinsi: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_provinsi: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    id_negara: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "provinsi",
    timestamps: true,
  }
);

module.exports = provinsi;
