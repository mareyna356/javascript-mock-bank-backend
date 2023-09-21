'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Cuenta', [
      {
        claveCuenta: 4,
        saldo: 50.23,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        claveCuenta: 17,
        saldo: 5105.69,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Cuenta', null, {});
  }
};
