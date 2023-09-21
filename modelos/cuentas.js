const models = require('../models');

//Consigue todas las cuentas
exports.getAll = async function () {
   let cuentas = await models.Cuenta.findAll();
   let result = [];
   let chs;
   let cuentahabientes;
   for (let i = 0; i < cuentas.length; i++) {
      cuentahabientes = await cuentas[i].getCuentahabientes();
      chs = [];
      for (let j = 0; j < cuentahabientes.length; j++) {
         chs.push({
            claveCuentahabiente: cuentahabientes[j].claveCuentahabiente,
            nombre: cuentahabientes[j].nombre,
            edad: cuentahabientes[j].edad
         });
      }
      result.push({
         claveCuenta: cuentas[i].claveCuenta,
         saldo: cuentas[i].saldo,
         cuentahabientes: chs
      });
   }
   return result;
};

//Consigue la cuenta con la clave ingresada
exports.getById = async function (id) {
   let cuenta = await models.Cuenta.findOne({
      where: {
         claveCuenta: id
      }
   });
   if (cuenta) {
      let cuentahabientes = await cuenta.getCuentahabientes();
      let chs = [];
      cuentahabientes.forEach(cuentahabiente => {
         chs.push({
            claveCuentahabiente: cuentahabiente.claveCuentahabiente,
            nombre: cuentahabiente.nombre,
            edad: cuentahabiente.edad
         });
      });
      let resultado = {
         claveCuenta: cuenta.claveCuenta,
         saldo: cuenta.saldo,
         cuentahabientes: chs
      }
      return resultado;
   } else {
      throw {
         type: 'error',
         status: 404,
         msg: 'No se encontró una cuenta con la clave de ' + id
      };
   }
};

//Crea una nueva cuenta
exports.add = async function (id, saldo, cuentahabientes) {
   //Verifica la claveCuenta (id)
   if (!Number.isInteger(id) || id <= 0) {
      throw {
         type: 'error',
         status: 403,
         msg: 'La clave tiene que ser un número entero mayor a 0'
      };
   }
   //Verifica el saldo
   if (typeof(saldo) != 'number' || saldo < 0) {
      throw {
         type: 'error',
         status: 403,
         msg: 'El saldo debe ser un número mayor o igual a 0'
      };
   }
   //Convierte el saldo a dos decimales (redondea a 2 decimales si es necesario)
   saldo = saldo.toFixed(2);
   saldo = parseFloat(saldo);
   //Verifica que los cuentahabientes a asociar a la cuenta existen
   let aActualizar = []; //Los cuentahabientes se van almacenando para luego asociarlos a la cuenta
   if (!(await verificaCHExistentes(cuentahabientes, aActualizar))) {
      throw {
         type: 'error',
         status: 403,
         msg: 'La cuenta debe pertenecer a por lo menos 1 cuentahabiente existente con clave numérica'
      };
   }
   //Crea la nueva cuenta
   try {
      let cuenta = await models.Cuenta.create({
         claveCuenta: id,
         saldo: saldo,
         createdAt: new Date(),
         updatedAt: new Date()
      });
      await cuenta.addCuentahabientes(aActualizar);
      return cuenta;
   } catch (error) {
      throw {
         type: 'error',
         status: 403,
         msg: 'Ya existe una cuenta con la clave de ' + id
      };
   }
};

//Verifica que los cuentahabientes especificados sí existen
const verificaCHExistentes = async function (cuentahabientes, aActualizar) {
   //Verifica que cuentahabientes en un arreglo no vacío
   if (!Array.isArray(cuentahabientes) || cuentahabientes.length == 0) {
      return false;
   }
   let clave;
   let cuentahabiente;
   //Verifica que el arreglo sólo contiene integers y que los cuentahabientes existen
   for (let i = 0; i < cuentahabientes.length; i++) {
      clave = cuentahabientes[i];
      if (!Number.isInteger(clave)) {
         return false;
      }
      cuentahabiente = await models.Cuentahabiente.findOne({
         where: {
            claveCuentahabiente: clave
         }
      });
      if (!cuentahabiente) {
         return false;
      }
      //Almacena cada cuentahabiente para luego asociarlos a la cuenta que se está creando
      aActualizar.push(cuentahabiente);
   }
   return true;
};

//Deposita dinero
exports.deposita = async function (id, deposito) {
   //Verifica que existe la cuenta a la que se depositará
   let cuenta = await models.Cuenta.findOne({
      where: {
         claveCuenta: id
      }
   });
   if (!cuenta) {
      throw {
         type: 'error',
         status: 404,
         msg: 'No se encontró una cuenta con la clave de ' + id
      };
   }
   //Verifica deposito
   if (typeof(deposito) != 'number' || deposito <= 0) {
      throw {
         type: 'error',
         status: 403,
         msg: 'El depósito debe ser un número mayor a 0'
      };
   }
   //Convierte el depósito a dos decimales (redondea a 2 decimales si es necesario)
   deposito = deposito.toFixed(2);
   deposito = parseFloat(deposito);
   //Realiza el depósito
   cuenta.saldo += deposito;
   await cuenta.save();
   return cuenta;
};

//Retira dinero
exports.retira = async function (id, retiro) {
   //Verifica que existe la cuenta de la que se retirará
   let cuenta = await models.Cuenta.findOne({
      where: {
         claveCuenta: id
      }
   });
   if (!cuenta) {
      throw {
         type: 'error',
         status: 404,
         msg: 'No se encontró una cuenta con la clave de ' + id
      };
   }
   //Verifica retiro
   if (typeof(retiro) != 'number' || retiro <= 0) {
      throw {
         type: 'error',
         status: 403,
         msg: 'El retiro debe ser un número mayor a 0'
      };
   }
   //Convierte el retiro a dos decimales (redondea a 2 decimales si es necesario)
   retiro = retiro.toFixed(2);
   retiro = parseFloat(retiro);
   //Verifica que no se está retirando más de lo que tiene la cuenta
   let resultado = cuenta.saldo - retiro;
   if (resultado < 0) {
      throw {
         type: 'error',
         status: 403,
         msg: 'El retiro no puede ser mayor al saldo de la cuenta'
      };
   }
   //Realiza el retiro
   cuenta.saldo = resultado;
   await cuenta.save();
   return cuenta;
};

//Transfiere dinero
exports.transfiere = async function (idFuente, idDestino, transferencia) {
   //Verifica que la cuenta fuente y la de destino no sean la misma
   if (idFuente == idDestino) {
      throw {
         type: 'error',
         status: 403,
         msg: 'La cuenta fuente y la cuenta destino no pueden ser las mismas'
      };
   }
   //Verifica que existe la cuenta fuente
   let cuentaF = await models.Cuenta.findOne({
      where: {
         claveCuenta: idFuente
      }
   });
   if (!cuentaF) {
      throw {
         type: 'error',
         status: 404,
         msg: 'No se encontró una cuenta fuente con la clave de ' + idFuente
      };
   }
   //Verifica que existe la cuenta destino
   let cuentaD = await models.Cuenta.findOne({
      where: {
         claveCuenta: idDestino
      }
   });
   if (!cuentaD) {
      throw {
         type: 'error',
         status: 404,
         msg: 'No se encontró una cuenta destino con la clave de ' + idDestino
      };
   }
   //Verifica transferencia
   if (typeof(transferencia) != 'number' || transferencia <= 0) {
      throw {
         type: 'error',
         status: 403,
         msg: 'La transferencia debe ser un número mayor a 0'
      };
   }
   //Convierte la transferencia a dos decimales (redondea a 2 decimales si es necesario)
   transferencia = transferencia.toFixed(2);
   transferencia = parseFloat(transferencia);
   //Verifica que no se está transfiriendo de la cuenta fuente más de lo que tiene
   let resultado = cuentaF.saldo - transferencia;
   if (resultado < 0) {
      throw {
         type: 'error',
         status: 403,
         msg: 'La transferencia no puede ser mayor al saldo de la cuenta fuente'
      };
   }
   //Realiza la transferencia
   cuentaF.saldo = resultado;
   cuentaD.saldo += transferencia;
   await cuentaF.save();
   await cuentaD.save();
   let cuentasFyD = [cuentaF, cuentaD];
   return cuentasFyD;
};

//Cancela una cuenta
exports.borraPorId = async function (id) {
   //Verifica que existe la cuenta a cancelar
   let cuenta = await models.Cuenta.findOne({
      where: {
         claveCuenta: id
      }
   });
   if (!cuenta) {
      throw {
         type: 'error',
         status: 404,
         msg: 'No se encontró una cuenta con la clave de ' + id
      };
   }
   //Verifica que el saldo no sea 0
   if (cuenta.saldo != 0) {
      throw {
         type: 'error',
         status: 403,
         msg: 'Esta cuenta no se puede cancelar; no tiene saldo en 0'
      };
   }
   //Desasocia la cuenta de todos los cuentahabientes
   let cuentahabientes = await cuenta.getCuentahabientes();
   await cuenta.removeCuentahabientes(cuentahabientes);
   //Elimina la cuenta
   await cuenta.destroy();
   return cuenta;
};

//Consultar saldo de cierta cuenta
exports.getSaldo = async function (id) {
   let cuenta = await models.Cuenta.findOne({
      where: {
         claveCuenta: id
      }
   });
   if (!cuenta) {
      throw {
         type: 'error',
         status: 404,
         msg: 'No se encontró una cuenta con la clave de ' + id
      };
   }
   return cuenta.saldo;
}