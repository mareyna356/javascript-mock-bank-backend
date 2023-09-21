const models = require('../models');

//Consigue todos los usuarios
exports.getAll = async function () {
   let users = await models.User.findAll();
   return users;
};