"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class perhitungan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.jenis_kendaraan, {
        as: "jenis_kendaraan",
        foreignKey: {
          name: "jenisKendaraanId",
        },
      });
    }
  }
  perhitungan.init(
    {
      nama_rute: DataTypes.STRING,
      tanggal_pengiriman: DataTypes.DATE,
      yi: DataTypes.INTEGER,
      total_berat_paket: DataTypes.INTEGER,
      total_paket: DataTypes.INTEGER,
      tujuan: DataTypes.STRING,
      keterangan: DataTypes.STRING,
      jenisKendaraanId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "perhitungan",
    }
  );
  return perhitungan;
};
