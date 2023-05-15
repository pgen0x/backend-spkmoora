'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bobot_kriteria', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kriteriaPenilaianId: {
        type: Sequelize.INTEGER
      },
      nilai: {
        type: Sequelize.STRING
      },
      isMinMax: {
        type: Sequelize.BOOLEAN
      },
      min_nilai: {
        type: Sequelize.INTEGER
      },
      max_nilai: {
        type: Sequelize.INTEGER
      },
      bobotkriteria: {
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
    await queryInterface.dropTable('bobot_kriteria');
  }
};