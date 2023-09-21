const c = require('../modelos/cuentas');

//Leer todas las cuentas
exports.getAllCuentas = async function (req, res) {
    let todos = await c.getAll();
    res.status(200).json(todos);
};

//Leer la cuenta de cierta id
exports.getCbyId = async function (req, res) {
    try {
        let cuenta = await c.getById(req.params.id);
        res.status(200).json(cuenta);
    } catch (error) {
        res.status(error.status).json(error);
    }
};

//Crea una nueva cuenta
exports.addC = async function (req, res) {
    try {
        let cuenta = await c.add(req.body.id, req.body.saldo, req.body.cuentahabientes);
        res.status(200).json(cuenta);
    } catch (error) {
        res.status(error.status).json(error);
    }
};

//Deposita dinero
exports.deposita = async function (req, res) {
    try {
        let cuenta = await c.deposita(req.params.id, req.body.deposito);
        res.status(200).json(cuenta);
    } catch (error) {
        res.status(error.status).json(error);
    }
}

//Retira dinero
exports.retira = async function (req, res) {
    try {
        let cuenta = await c.retira(req.params.id, req.body.retiro);
        res.status(200).json(cuenta);
    } catch (error) {
        res.status(error.status).json(error);
    }
}

//Transfiere dinero
exports.transfiere = async function (req, res) {
    try {
        let cuentasFyD = await c.transfiere(req.params.idFuente, req.params.idDestino, req.body.transferencia);
        res.status(200).json(cuentasFyD);
    } catch (error) {
        res.status(error.status).json(error);
    }
}

//Cancela una cuenta específica
exports.borraPorId = async function (req, res) {
    try {
        let borrada = await c.borraPorId(req.params.id);
        res.status(200).json(borrada);
    } catch (error) {
        res.status(error.status).json(error);
    }
}

//Consultar saldo de cierta cuenta
exports.getSaldo = async function (req, res) {
    try {
        let saldo = await c.getSaldo(req.params.id);
        res.status(200).json(saldo);
    } catch (error) {
        res.status(error.status).json(error);
    }
}