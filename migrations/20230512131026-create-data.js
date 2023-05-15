'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('data', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama_rute: {
        type: Sequelize.STRING
      },
      tanggal_pengiriman: {
        type: Sequelize.DATE
      },
      total_berat_paket: {
        type: Sequelize.INTEGER
      },
      tujuan: {
        type: Sequelize.STRING
      },
      total_paket: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('data');
  }
};