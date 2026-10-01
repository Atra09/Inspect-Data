const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const pelabuhan = db.define(
  "pelabuhan",
  {
    id_pelabuhan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_pelabuhan: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    tableName: "pelabuhan",
    timestamps: true,
  }
);

module.exports = pelabuhan;
