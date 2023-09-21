const models = require('../models');

//Consigue todos los cuentahabientes
exports.getAll = async function () {
   let cuentahabientes = await models.Cuentahabiente.findAll();
   let result = [];
   let cs;
   let cuentas;
   for (let i = 0; i < cuentahabientes.length; i++) {
      cuentas = await cuentahabientes[i].getCuenta();
      cs = [];
      for (let j = 0; j < cuentas.length; j++) {
         cs.push({
            claveCuenta: cuentas[j].claveCuenta,
            saldo: cuentas[j].saldo
         });
      }
      result.push({
         claveCuentahabiente: cuentahabientes[i].claveCuentahabiente,
         nombre: cuentahabientes[i].nombre,
         edad: cuentahabientes[i].edad,
         cuentas: cs
      });
   }
   return result;
}

//Consigue un cuentahabiente de cierta clave
exports.getById = async function (id) {
   let cuentahabiente = await models.Cuentahabiente.findOne({
      where: {
         claveCuentahabiente: id
      }
   });
   if (cuentahabiente) {
      let cuentas = await cuentahabiente.getCuenta();
      let cs = [];
      cuentas.forEach(cuenta => {
         cs.push({
            claveCuenta: cuenta.claveCuenta,
            saldo: cuenta.saldo
         });
      });
      let resultado = {
         claveCuentahabiente: cuentahabiente.claveCuentahabiente,
         nombre: cuentahabiente.nombre,
         edad: cuentahabiente.edad,
         cuentas: cs
      }
      return resultado;
   } else {
      throw {
         type: 'error',
         status: 404,
         msg: 'No se encontró un cuentahabiente con la clave de ' + id
      };
   }
};

//Agrega un cuentahabiente
exports.add = async function (id, nombre, edad) {
   //Verifica la claveCuentahabiente (id)
   if (!Number.isInteger(id) || id <= 0) {
      throw {
         type: 'error',
         status: 403,
         msg: 'La clave tiene que ser un número entero mayor a 0'
      };
   }
   //Verifica el nombre
   if (typeof (nombre) != 'string' || nombre.length == 0) {
      throw {
         type: 'error',
         status: 403,
         msg: 'El nombre debe ser un string no vacío'
      };
   }
   //Verifica la edad
   if (!Number.isInteger(edad) || edad < 0) {
      throw {
         type: 'error',
         status: 403,
         msg: 'La edad tiene que ser un número entero mayor o igual a 0'
      };
   }
   //Regresará error si ya existe un cuentahabiente con la misma clave
   try {
      let cuentahabiente = await models.Cuentahabiente.create({
         claveCuentahabiente: id,
         nombre: nombre,
         edad: edad,
         createdAt: new Date(),
         updatedAt: new Date()
      });
      return cuentahabiente;
   } catch (error) {
      throw {
         type: 'error',
         status: 403,
         msg: 'Ya existe un cuentahabiente con la clave de ' + id
      };
   }
};

//Modifica el nombre y la edad de un cuentahabiente
exports.modify = async function (id, nombre, edad) {
   //Verifica que existe el cuentahabiente con la clave ingresada
   let cuentahabiente = await models.Cuentahabiente.findOne({
      where: {
         claveCuentahabiente: id
      }
   });
   if (!cuentahabiente) {
      throw {
         type: 'error',
         status: 404,
         msg: 'No existe un cuentahabiente con la clave de ' + id
      };
   }
   //Verifica el nombre
   if (typeof (nombre) != 'string' || nombre.length == 0) {
      throw {
         type: 'error',
         status: 403,
         msg: 'El nombre debe ser un string no vacío'
      };
   }
   //Verifica la edad
   if (!Number.isInteger(edad) || edad < 0) {
      throw {
         type: 'error',
         status: 403,
         msg: 'La edad tiene que ser un número entero mayor o igual a 0'
      };
   }
   //Modifica nombre y edad
   cuentahabiente.nombre = nombre;
   cuentahabiente.edad = edad;
   await cuentahabiente.save();
   return cuentahabiente;
};

//Modifica el nombre y/o la edad de un cuentahabiente
exports.patch = async function (id, nombre, edad) {
   //Verifica que existe el cuentahabiente con la clave ingresada
   let cuentahabiente = await models.Cuentahabiente.findOne({
      where: {
         claveCuentahabiente: id
      }
   });
   if (!cuentahabiente) {
      throw {
         type: 'error',
         status: 404,
         msg: 'No existe un cuentahabiente con la clave de ' + id
      };
   }
   //Verifica que se ingresó por lo menos nombre o edad
   if (typeof (nombre) == 'undefined' && typeof (edad) == 'undefined') {
      throw {
         type: 'error',
         status: 403,
         msg: 'Introduzca un parámetro válido a modificar (nombre y/o edad)'
      };
   }
   //Verifica el nombre si se ingresó
   if (typeof (nombre) != 'undefined' && (typeof (nombre) != 'string' || nombre.length == 0)) {
      throw {
         type: 'error',
         status: 403,
         msg: 'El nombre debe ser un string no vacío'
      };
   }
   //Verifica la edad si se ingresó
   if (typeof (edad) != 'undefined' && (!Number.isInteger(edad) || edad < 0)) {
      throw {
         type: 'error',
         status: 403,
         msg: 'La edad tiene que ser un número entero mayor o igual a 0'
      };
   }
   //Modifica lo ingresado
   if (typeof (nombre) != 'undefined')
      cuentahabiente.nombre = nombre;
   if (typeof (edad) != 'undefined')
      cuentahabiente.edad = edad;
   await cuentahabiente.save();
   return cuentahabiente;
};

//Elimina a un cuentahabiente
exports.borraPorId = async function (id) {
   //Verifica que existe el cuentahabiente con la clave ingresada
   let cuentahabiente = await models.Cuentahabiente.findOne({
      where: {
         claveCuentahabiente: id
      }
   });
   if (!cuentahabiente) {
      throw {
         type: 'error',
         status: 404,
         msg: 'No existe un cuentahabiente con la clave de ' + id
      };
   }
   //Verifica que el cuentahabiente no está asociado a ninguna cuenta
   let num = await cuentahabiente.countCuenta();
   if (num != 0) {
      throw {
         type: 'error',
         status: 403,
         msg: 'Primero debe desasociar todas las cuentas de este cuentahabiente antes de eliminarlo'
      };
   }
   //Elimina al cuentahabiente
   await cuentahabiente.destroy();
   return cuentahabiente;
};

//Asocia una cuenta a un cuentahabiente
exports.asocia = async function (id, idCuenta) {
   //Verifica que existe el cuentahabiente con la clave ingresada
   let cuentahabiente = await models.Cuentahabiente.findOne({
      where: {
         claveCuentahabiente: id
      }
   });
   if (!cuentahabiente) {
      throw {
         type: 'error',
         status: 404,
         msg: 'No existe un cuentahabiente con la clave de ' + id
      };
   }
   //Verifica que existe la cuenta con la clave (idCuenta) ingresada
   let cuenta = await models.Cuenta.findOne({
      where: {
         claveCuenta: idCuenta
      }
   });
   if (!cuenta) {
      throw {
         type: 'error',
         status: 404,
         msg: 'No existe una cuenta con la clave de ' + idCuenta
      };
   }
   //Verifica que el cuentahabiente no está ya asociado a la cuenta
   let asociado = await cuentahabiente.hasCuenta(cuenta);
   if (asociado) {
      throw {
         type: 'error',
         status: 403,
         msg: 'Este cuentahabiente ya tiene esa cuenta asociada'
      };
   }
   //Realiza la asociación
   await cuentahabiente.addCuenta(cuenta);
   let parCHyC = [cuentahabiente, cuenta];
   return parCHyC;
}

//Desasocia una cuenta de un cuentahabiente
exports.desasocia = async function (id, idCuenta) {
   //Verifica que existe el cuentahabiente con la clave ingresada
   let cuentahabiente = await models.Cuentahabiente.findOne({
      where: {
         claveCuentahabiente: id
      }
   });
   if (!cuentahabiente) {
      throw {
         type: 'error',
         status: 404,
         msg: 'No existe un cuentahabiente con la clave de ' + id
      };
   }
   //Verifica que existe la cuenta con la clave (idCuenta) ingresada
   let cuenta = await models.Cuenta.findOne({
      where: {
         claveCuenta: idCuenta
      }
   });
   if (!cuenta) {
      throw {
         type: 'error',
         status: 404,
         msg: 'No existe una cuenta con la clave de ' + idCuenta
      };
   }
   //Verifica que el cuentahabiente está asociado a la cuenta
   let asociado = await cuentahabiente.hasCuenta(cuenta);
   if (!asociado) {
      throw {
         type: 'error',
         status: 403,
         msg: 'Este cuentahabiente no tiene esa cuenta asociada'
      };
   }
   //Verifica que la cuenta no tiene sólo un cuentahabiente asociado
   let num = await cuenta.countCuentahabientes();
   if (num == 1) {
      throw {
         type: 'error',
         status: 403,
         msg: 'Esta cuenta sólo está asociada a este cuentahabiente; no se puede desasociar'
      };
   }
   //Realiza la desasociación
   await cuentahabiente.removeCuenta(cuenta);
   let parCHyC = [cuentahabiente, cuenta];
   return parCHyC;
}