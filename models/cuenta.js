'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cuenta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cuenta.belongsToMany(models.Cuentahabiente, {
        through: models.CuentahabienteCuentas
      });
    };
  };
  Cuenta.init({
    claveCuenta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      min: 1,
      unique: true
    },
    saldo: {
      type: DataTypes.FLOAT,
      allowNull: false,
      min: 0
    }
  }, {
    sequelize,
    modelName: 'Cuenta',
  });
  return Cuenta;
};