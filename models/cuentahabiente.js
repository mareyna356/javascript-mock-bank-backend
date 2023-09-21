'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cuentahabiente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cuentahabiente.belongsToMany(models.Cuenta, {
        through: models.CuentahabienteCuentas
      });
    };
  };
  Cuentahabiente.init({
    claveCuentahabiente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      min: 1,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true
    },
    edad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      min: 0
    }
  }, {
    sequelize,
    modelName: 'Cuentahabiente',
  });
  return Cuentahabiente;
};