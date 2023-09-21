const express = require('express');
const router = express.Router();
const ctrl = require('../controladores/controladorCuentahabientes');
const passport = require('../auth/passport');

/*En las siguientes instrucciones, id se refiere a lo que sería
  la claveCuentahabiente en las tablas relacionales, no la id
  de las tablas
*/

//Agrega un nuevo cuentahabiente
/*
	Cuerpo de post:
	{
		id (number),
		nombre (string),
		edad (number)
	}
*/
router.post('/cuentahabientes', passport.authenticate("jwt",{session: false}), ctrl.addCH);

//Leer todos los cuentahabientes
router.get('/cuentahabientes', passport.authenticate("jwt",{session: false}), ctrl.getAllCuentahabientes);

//Leer el cuentahabiente de cierto id
router.get('/cuentahabientes/:id', passport.authenticate("jwt",{session: false}), ctrl.getCHbyId);

//Cambia el nombre y la edad de un cuentahabiente
/*
	Cuerpo de put:
	{
		nombre (string),
		edad (number)
	}
*/
router.put('/cuentahabientes/:id', passport.authenticate("jwt",{session: false}), ctrl.putCH);

//Cambia el nombre y/o la edad de un cuentahabiente
/*
	Opciones de cuerpo de patch:
	{
		nombre (string),
		edad (number)
	}
*/
router.patch('/cuentahabientes/:id', passport.authenticate("jwt",{session: false}), ctrl.patchCH);

//Asocia una cuenta a un cuentahabiente
/*
	Cuerpo de patch:
	{
		idCuenta (number)
	}
	idCuenta es la claveCuenta de las tablas relacionales
*/
router.patch('/cuentahabientes/:id/asocia', passport.authenticate("jwt",{session: false}), ctrl.asocia);

//Desasocia una cuenta de un cuentahabiente
/*
	Cuerpo de patch:
	{
		idCuenta (number)
	}
	idCuenta es la claveCuenta de las tablas relacionales
*/
router.patch('/cuentahabientes/:id/desasocia', passport.authenticate("jwt",{session: false}), ctrl.desasocia);

//Elimina a un cuentahabiente
router.delete('/cuentahabientes/:id', passport.authenticate("jwt",{session: false}), ctrl.borraPorId);

module.exports = router;