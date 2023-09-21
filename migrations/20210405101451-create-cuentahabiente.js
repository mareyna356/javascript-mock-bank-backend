'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Cuentahabientes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      claveCuentahabiente: {
        type: Sequelize.INTEGER,
        allowNull: false,
        min: 1,
        unique: true
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true
      },
      edad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        min: 0
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Cuentahabientes');
  }
};