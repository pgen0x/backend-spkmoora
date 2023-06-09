'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class kriteria_penilaian extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  kriteria_penilaian.init({
    kode_kriteria: DataTypes.STRING,
    nama_kriteria: DataTypes.STRING,
    bobot: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'kriteria_penilaian',
  });
  return kriteria_penilaian;
};