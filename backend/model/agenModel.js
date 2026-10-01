const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const agen = db.define(
  "agen",
  {
    id_agen: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_agen: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    tableName: "agen",
    timestamps: true,
  }
);

module.exports = agen;
