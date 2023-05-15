'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class aturan_penilaian extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  aturan_penilaian.init({
    keterangan: DataTypes.STRING,
    nilai: DataTypes.STRING,
    descnilai: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'aturan_penilaian',
  });
  return aturan_penilaian;
};