const express = require('express');
const router = express.Router();
const ctrl = require('../controladores/controladorCuentas');
const passport = require('../auth/passport');

/*En las siguientes instrucciones, id se refiere a lo que sería
  la claveCuenta en las tablas relacionales, no la id de las tablas
*/

//Crea una nueva cuenta
/*
	Cuerpo de post:
	{
		id (number),
		saldo (number),
		cuentahabientes (array de numbers)
	}
*/
router.post('/cuentas', passport.authenticate("jwt",{session: false}), ctrl.addC);

//Leer todas las cuentas
router.get('/cuentas', passport.authenticate("jwt",{session: false}), ctrl.getAllCuentas);

//Leer la cuenta de cierta id
router.get('/cuentas/:id', passport.authenticate("jwt",{session: false}), ctrl.getCbyId);

//Consultar saldo de cierta cuenta
router.get('/cuentas/:id/saldo', passport.authenticate("jwt",{session: false}), ctrl.getSaldo);

//Deposita dinero
/*
	Cuerpo de patch:
	{
		deposito (number)
	}
*/
router.patch('/cuentas/:id/deposito', passport.authenticate("jwt",{session: false}), ctrl.deposita);

//Retira dinero
/*
	Cuerpo de patch:
	{
		retiro (number)
	}
*/
router.patch('/cuentas/:id/retiro', passport.authenticate("jwt",{session: false}), ctrl.retira);

//Transfiere dinero
/*
	Cuerpo de patch:
	{
		transferencia (number)
	}
*/
router.patch('/cuentas/:idFuente/transferencia/:idDestino', passport.authenticate("jwt",{session: false}), ctrl.transfiere);

//Cancela una cuenta específica
router.delete('/cuentas/:id', passport.authenticate("jwt",{session: false}), ctrl.borraPorId);

module.exports = router;