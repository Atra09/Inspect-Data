const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const asal_kapal = db.define(
  "asal_kapal",
  {
    id_asal_kapal: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_asal_kapal: DataTypes.STRING,
  },
  {
    tableName: "asal_kapal",
    timestamps: true,
  }
);

module.exports = asal_kapal;
