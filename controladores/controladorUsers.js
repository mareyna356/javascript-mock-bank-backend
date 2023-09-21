const u = require('../modelos/users');

//Leer todos los users
exports.getAllUsers = async function (req, res) {
    let todos = await u.getAll();
    res.status(200).json(todos);
};