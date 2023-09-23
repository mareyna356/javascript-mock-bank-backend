# javascript-mock-bank-backend
My very first JavaScript back-end (made with [Express.js](https://expressjs.com/) and [Sequelize](https://sequelize.org/)), made for my JavaScript course during my 6th semester at the Autonomous University of Baja California (February - May, 2021): a REST API for a basic mock bank system. This API provides services to my [front-end](https://github.com/mareyna356/javascript-mock-bank-frontend) in the form of JSON objects by obtaining data from, and writing data into, a [MySQL](https://www.mysql.com/) database, thus you'll need MySQL installed on your computer.

This API utilizes HTTPS, so you require an SSL certificate and private key for it to execute. I utilized [OpenSSL](https://www.openssl.org/) to generate my self-signed certificate and private key. The certificate and private key must be named ***certificate.crt*** and ***private.key*** respectively, and both must be present on the same level as [***app.js***](app.js). The required names for the certificate and the private key can be changed, if you so wish, in [***app.js***](app.js). If the front-end throws a "**Cross-Origin Request Blocked**" error, which prevents the front-end from interacting with the back-end, then it's necessary to first access the back-end through your browser and manually accept the self-signed certificate.

As I've mentioned previously, the back-end needs to connect to a MySQL database. The configuration for this connection can be found in [***config/config.json***](config/config.json), where you'll have to modify the "**development**" credentials to establish the connection to your MySQL database. Whichever MySQL user you choose needs to have all privileges for the chosen database.

The [***migrations***](migrations) folder contains four migrations files that allow you to create the necessary tables in the MySQL database by executing the command `npx sequelize-cli db:migrate`. If you wish to erase these tables later on, execute `npx sequelize-cli db:migrate:undo:all`.

The [***seeders***](seeders) folder contains two seeders files that allow you to insert initial testing data into the MySQL database by executing the command `npx sequelize-cli db:seed:all`. Of course, for this data to be inserted into the database, the tables from the [***migrations***](migrations) folder must be already created. To erase this initial data from the database, execute `npx sequelize-cli db:seed:undo:all`.

To run the back-end, execute `node app.js`.

## Routes for HTTP requests

All HTTP requests to this API return JSON objects (except for `GET /`, which returns a string). All the POST, PUT and PATCH requests require JSON objects as their payload bodies.

NOTE: "id" in the payload body JSONs of the PUT requests refer to "claveCuenta" and "claveCuentahabiente" in the MySQL tables, not the fields literally called "id" from those tables. Giving the **cuenta** and **cuentahabientes** tables an "id" field and separate "claveCuenta"/"claveCuentahabiente" fields was a request from my professor, but for the sake of simplicity I decided to shorten both to just "id" in the JSONs that have to be sent in PUT requests.

### No token required

#### To get the API instructions: `GET /`
Returns a string object.

#### To log in: `POST /login`
Body:
```
{
  "username": string,
  "password": string
}
```
Response:
```
{
  "msg": string,
  "token": string
}
```

### Token required
All the following requests require the login token in their headers as shown below:
```
Authorization: Bearer [token here without brackets]
```

#### To get all login users: `GET /users`
Response (an array of JSONs with the following format):
```
{
  "id": number,
  "username": string,
  "password": string,
  "createdAt": string,
  "updatedAt": string
}
```
The response will be an empty array if there are no users.

#### Create a new account holder (cuentahabiente): `POST /cuentahabientes`
Body ("id" has to be a non-0 and non-negative integer; "edad" has to be a non-negative integer):
```
{
  "id": number,
  "nombre": string,
  "edad": number
}
```
Response (the same new cuentahabiente that was just registered but as it shows up in MySQL):
```
{
  "id": number,
  "claveCuentahabiente": number,
  "nombre": string,
  "edad": number,
  "createdAt": string,
  "updatedAt": string
}
```

#### Get all account holders: `GET /cuentahabientes`
Response (an array of JSONs with the following format):
```
{
  "claveCuentahabiente": number,
  "nombre": string,
  "edad": number,
  "cuentas": array of JSONs with the following format
              {
                "claveCuenta": number,
                "saldo": number
              }
}
```
The response will be an empty array instead if there are no account holders.
The array of "cuentas" will be empty if there are no accounts associated to that specific account holder.

#### Get a specific account holder by its id (claveCuentahabiente): `GET /cuentahabientes/:id`
Response:
```
{
  "claveCuentahabiente": number,
  "nombre": string,
  "edad": number,
  "cuentas": array of JSONs with the following format
              {
                "claveCuenta": number,
                "saldo": number
              }
}
```
The array of "cuentas" will be empty if there are no accounts associated.

#### Change the name and age of an account holder specified by its id (claveCuentahabiente): `PUT /cuentahabientes/:id`
Body ("edad" has to be a non-negative integer):
```
{
  "nombre": string,
  "edad": number
}
```
Response (the same cuentahabiente that was just modified but as it shows up in MySQL):
```
{
  "id": number,
  "claveCuentahabiente": number,
  "nombre": string,
  "edad": number,
  "createdAt": string,
  "updatedAt": string
}
```

#### Change the name and/or age of an account holder specified by its id (claveCuentahabiente): `PATCH /cuentahabientes/:id`
Body (it can include both of the keys, "nombre" and "edad", or only one of them; "edad" has to be a non-negative integer):
```
{
  "nombre": string,
  "edad": number
}
```
Response (the same cuentahabiente that was just modified but as it shows up in MySQL):
```
{
  "id": number,
  "claveCuentahabiente": number,
  "nombre": string,
  "edad": number,
  "createdAt": string,
  "updatedAt": string
}
```

#### Associate an account to the account holder of the specified id (claveCuentahabiente): `PATCH /cuentahabientes/:id/asocia`
Body ("idCuenta" is the "claveCuenta" of the account to associate):
```
{
  "idCuenta": number
}
```
Response (an array that contains the account holder and the account that were just associated with each other):
```
[
  {
    "id": number,
    "claveCuentahabiente": number,
    "nombre": string,
    "edad": number,
    "createdAt": string,
    "updatedAt": string
  },
  {
    "id": number,
    "claveCuenta": number,
    "saldo": number,
    "createdAt": string,
    "updatedAt": string
  }
]
```

#### Disassociate an account from the account holder of the specified id (claveCuentahabiente): `PATCH /cuentahabientes/:id/desasocia`
Body ("idCuenta" is the "claveCuenta" of the account to disassociate):
```
{
  "idCuenta": number
}
```
Response (an array that contains the account holder and the account that were just disassociated from each other):
```
[
  {
    "id": number,
    "claveCuentahabiente": number,
    "nombre": string,
    "edad": number,
    "createdAt": string,
    "updatedAt": string
  },
  {
    "id": number,
    "claveCuenta": number,
    "saldo": number,
    "createdAt": string,
    "updatedAt": string
  }
]
```

#### Delete a specific account holder by its id (claveCuentahabiente): `DELETE /cuentahabientes/:id`
Response (the account holder that was just deleted):
```
{
  "id": number,
  "claveCuentahabiente": number,
  "nombre": string,
  "edad": number,
  "createdAt": string,
  "updatedAt": string
}
```
NOTE: You can only delete account holders that aren't associated to any account.
