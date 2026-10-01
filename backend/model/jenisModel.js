const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const jenis = db.define(
  "jenis",
  {
    id_jenis: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_jenis: DataTypes.STRING,
  },
  {
    tableName: "jenis",
    timestamps: true,
  }
);

module.exports = jenis;
