const jwt = require('jsonwebtoken');
const llave = require('../auth/llave');
const models = require('../models');

exports.login = async function (req, res) {
    const { username, password } = req.body;
    if (!(username && password)) {
        res.status(400).json({ msg: `Formato incorrecto: ${JSON.stringify(req.body)}` });
        return;
    }
    let user = await models.User.findOne({
        where: {
            username: username
        }
    });
    if (!user || user.password !== password) {
        res.status(401).json({ msg: "Usuario y/o contraseña incorrecto" });
        return;
    }
    let token = jwt.sign({ id: user.id }, llave);
    res.json({ msg: "ok", token: token });
}