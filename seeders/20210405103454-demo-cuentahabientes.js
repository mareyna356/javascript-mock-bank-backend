'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Cuentahabientes', [
      {
        claveCuentahabiente: 60,
        nombre: 'John Doe',
        edad: 29,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        claveCuentahabiente: 32,
        nombre: 'Gorila',
        edad: 31,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Cuentahabientes', null, {});
  }
};
