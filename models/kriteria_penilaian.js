"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kriteria_Penilaian extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Kriteria_Penilaian.init(
    {
      kode_kriteria: DataTypes.STRING,
      nama_kriteria: DataTypes.STRING,
      bobot: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Kriteria_Penilaians",
    }
  );
  return Kriteria_Penilaian;
};
