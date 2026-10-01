const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const negara = db.define(
  "negara",
  {
    id_negara: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_negara: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    kode_negara: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    tableName: "negara",
    timestamps: true,
  }
);

module.exports = negara;
