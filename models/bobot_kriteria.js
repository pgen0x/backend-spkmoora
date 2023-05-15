"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class bobot_kriteria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.kriteria_penilaian, {
        as: "kriteria_penilaian",
        foreignKey: {
          name: "kriteriaPenilaianId",
        },
      });
    }
  }
  bobot_kriteria.init(
    {
      kriteriaPenilaianId: DataTypes.INTEGER,
      nilai: DataTypes.STRING,
      isMinMax: DataTypes.BOOLEAN,
      min_nilai: DataTypes.INTEGER,
      max_nilai: DataTypes.INTEGER,
      bobotkriteria: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "bobot_kriteria",
    }
  );
  return bobot_kriteria;
};
