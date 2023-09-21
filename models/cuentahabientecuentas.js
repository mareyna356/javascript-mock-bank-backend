'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CuentahabienteCuentas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CuentahabienteCuentas.init({
    cuentahabienteId: DataTypes.INTEGER,
    cuentumId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CuentahabienteCuentas',
  });
  return CuentahabienteCuentas;
};