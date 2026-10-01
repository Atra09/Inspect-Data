const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const spbAsal = db.define(
  "spb_asal",
  {
    id_spb_asal: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    kode_spb: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    asal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "spb_asal",
    timestamps: true,
  }
);

module.exports = spbAsal;
