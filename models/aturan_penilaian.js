"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Aturan_Penilaian extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Aturan_Penilaian.init(
    {
      keterangan: DataTypes.STRING,
      nilai: DataTypes.STRING,
      descnilai: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Aturan_Penilaians",
    }
  );
  return Aturan_Penilaian;
};
