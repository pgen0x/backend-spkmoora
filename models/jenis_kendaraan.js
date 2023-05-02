"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Jenis_Kendaraan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Jenis_Kendaraan.init(
    {
      jenis_kendaraan: DataTypes.STRING,
      kapasitas_muatan: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Jenis_Kendaraans",
    }
  );
  return Jenis_Kendaraan;
};
