"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("perhitungan", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nama_rute: {
        type: Sequelize.STRING,
      },
      tanggal_pengiriman: {
        type: Sequelize.DATE,
      },
      yi: {
        type: Sequelize.INTEGER,
      },
      total_berat_paket: {
        type: Sequelize.INTEGER,
      },
      total_paket: {
        type: Sequelize.INTEGER,
      },
      tujuan: {
        type: Sequelize.STRING,
      },
      keterangan: {
        type: Sequelize.STRING,
      },
      jenisKendaraanId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("perhitungan");
  },
};
