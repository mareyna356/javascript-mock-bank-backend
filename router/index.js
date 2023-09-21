const express = require('express');
const router = express.Router();
const menu = require('../controladores/menu');
const routerC = require('./cuentas');
const routerCH = require('./cuentahabientes');
const passport = require('../auth/passport');
const controladorLogin = require('../controladores/controladorLogin');
const controladorUsers = require('../controladores/controladorUsers');

router.use(express.json());

router.use(routerC);
router.use(routerCH);

//Página de inicio
router.get('/', menu.opciones);

//login
router.post('/login', controladorLogin.login);
router.get('/users', passport.authenticate("jwt",{session: false}), controladorUsers.getAllUsers);

module.exports = router;