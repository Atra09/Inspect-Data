const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const kabupaten = db.define(
  "kabupaten",
  {
    id_kabupaten: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_kabupaten: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    id_provinsi: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "kabupaten",
    timestamps: true,
  }
);

module.exports = kabupaten;
