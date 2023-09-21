const ch = require('../modelos/cuentahabientes');

//Agrega un nuevo cuentahabiente
exports.addCH = async function (req, res) {
    try {
        let cuentahabiente = await ch.add(req.body.id, req.body.nombre, req.body.edad);
        res.status(200).json(cuentahabiente);
    } catch (error) {
        res.status(error.status).json(error);
    }
};

//Leer todos los cuentahabientes
exports.getAllCuentahabientes = async function (req, res) {
    let todos = await ch.getAll();
    res.status(200).json(todos);
};

//Leer el cuentahabiente de cierto id
exports.getCHbyId = async function (req, res) {
    try {
        let cuentahabiente = await ch.getById(req.params.id);
        res.status(200).json(cuentahabiente);
    } catch (error) {
        res.status(error.status).json(error);
    }
};

//Cambia el nombre y la edad de un cuentahabiente
exports.putCH = async function (req, res) {
    try {
        let cuentahabiente = await ch.modify(req.params.id, req.body.nombre, req.body.edad);
        res.status(200).json(cuentahabiente);
    } catch (error) {
        res.status(error.status).json(error);
    }
};

//Cambia el nombre y/o la edad de un cuentahabiente
exports.patchCH = async function (req, res) {
    try {
        let cuentahabiente = await ch.patch(req.params.id, req.body.nombre, req.body.edad);
        res.status(200).json(cuentahabiente);
    } catch (error) {
        res.status(error.status).json(error);
    }
};

//Elimina a un cuentahabiente
exports.borraPorId = async function (req, res) {
    try {
        let cuentahabiente = await ch.borraPorId(req.params.id);
        res.status(200).json(cuentahabiente);
    } catch (error) {
        res.status(error.status).json(error);
    }
};

//Asocia una cuenta a un cuentahabiente
exports.asocia = async function (req, res) {
    try {
        let parCHyC = await ch.asocia(req.params.id, req.body.idCuenta);
        res.status(200).json(parCHyC);
    } catch (error) {
        res.status(error.status).json(error);
    }
};

//Desasocia una cuenta de un cuentahabiente
exports.desasocia = async function (req, res) {
    try {
        let parCHyC = await ch.desasocia(req.params.id, req.body.idCuenta);
        res.status(200).json(parCHyC);
    } catch (error) {
        res.status(error.status).json(error);
    }
};