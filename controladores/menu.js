const texto = `Bienvenido al banco V5.\n
NOTA: id en las instrucciones se refiere a claveCuenta y claveCuentahabiente
      de las tablas relacionales, no a los campos llamados 'id' de las tablas
Agrega un nuevo cuentahabiente: POST /cuentahabientes
body:
{id (number), nombre (string), edad (number)}\n
Lee todos los cuentahabientes: GET /cuentahabientes\n
Lee el cuentahabiente de cierto id: GET /cuentahabientes/:id\n
Cambia el nombre y la edad de un cuentahabiente: PUT /cuentahabientes/:id
body:
{nombre (string), edad (number)}\n
Cambia el nombre y/o la edad de un cuentahabiente: PATCH /cuentahabientes/:id
body:
{nombre (string), edad (number)}\n
Asocia una cuenta existente a un cuentahabiente existente: PATCH /cuentahabientes/:id/asocia
body:
{idCuenta (number)}\n
Desasocia una cuenta de un cuentahabiente: PATCH /cuentahabientes/:id/desasocia
body:
{idCuenta (number)}\n
Elimina a un cuentahabiente: DELETE /cuentahabientes/:id\n
Crea una nueva cuenta: POST /cuentas
body:
{id (number), saldo (number), cuentahabientes (array de numbers)}\n
Lee todas las cuentas: GET /cuentas\n
Lee la cuenta de cierta id: GET /cuentas/:id\n
Consulta el saldo de una cierta cuenta: GET /cuentas/:id/saldo\n
Deposita dinero a una cuenta: PATCH /cuentas/:id/deposito
body:
{deposito (number)}\n
Retira dinero de una cuenta: PATCH /cuentas/:id/retiro
body:
{retiro (number)}\n
Transfiere dinero de una cuenta a otra: PATCH /cuentas/:idFuente/transferencia/:idDestino
body:
{transferencia (number)}\n
Cancela una cuenta: DELETE /cuentas/:id\n
Obtiene todas las cuentas para login: GET /users\n
Login: POST /login
body:
{username (string), password (string)}`;

exports.opciones = function (req, res) {
    res.status(200).json(texto);
}