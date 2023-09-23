# javascript-mock-bank-backend
My very first JavaScript back-end (made with [Express.js](https://expressjs.com/) and [Sequelize](https://sequelize.org/)), made for my JavaScript course during my 6th semester at the Autonomous University of Baja California (February - May, 2021): a REST API for a basic mock bank system. This API provides services to my [front-end](https://github.com/mareyna356/javascript-mock-bank-frontend) in the form of JSON objects by obtaining data from, and writing data into, a [MySQL](https://www.mysql.com/) database, thus you'll need MySQL installed on your computer.

This API utilizes HTTPS, so you require an SSL certificate and private key for it to execute. I utilized [OpenSSL](https://www.openssl.org/) to generate my self-signed certificate and private key. The certificate and private key must be named ***certificate.crt*** and ***private.key*** respectively, and both must be present on the same level as [***app.js***](app.js). The required names for the certificate and the private key can be changed, if you so wish, in [***app.js***](app.js). If the front-end throws a "**Cross-Origin Request Blocked**" error, which prevents the front-end from interacting with the back-end, then it's necessary to first access the back-end through your browser and manually accept the self-signed certificate.

As I've mentioned previously, the back-end needs to connect to a MySQL database. The configuration for this connection can be found in [***config/config.json***](config/config.json), where you'll have to modify the "**development**" credentials to establish the connection to your MySQL database. Whichever MySQL user you choose needs to have all privileges for the chosen database.

The [***migrations***](migrations) folder contains four migrations files that allow you to create the necessary tables in the MySQL database by executing the command `npx sequelize-cli db:migrate`. If you wish to erase these tables later on, execute `npx sequelize-cli db:migrate:undo:all`.

The [***seeders***](seeders) folder contains two seeders files that allow you to insert initial testing data into the MySQL database by executing the command `npx sequelize-cli db:seed:all`. Of course, for this data to be inserted into the database, the tables from the [***migrations***](migrations) folder must be already created. To erase this initial data from the database, execute `npx sequelize-cli db:seed:undo:all`.

To run the back-end, execute `node app.js`.

## MySQL Tables

### users

Users are used to log in to the bank system. They consist of an "**id**", a "**username**", and a "**password**". The "**createdAt**" and "**updatedAt**" fields are created automatically by the Sequelize ORM.

### cuenta

This table holds bank accounts. The table in theory should be called "cuentas", but Sequelize's naming strategy didn't work it out correctly. This table's fields are "**id**", "**claveCuenta**" (this is another type of id for the accounts, this is the id that the user is actually supposed to use to identify accounts for any operation in the front-end and the back-end), "**saldo**" (balance), "**createdAt**" and "**updatedAt**".

### cuentahabientes

This table holds bank account holders. This table's fields are "**id**", "**claveCuentahabiente**" (this is another type of id for the account holders, this is the id that the user is actually supposed to use to identify account holders for any operation in the front-end and the back-end), "**nombre**" (name), "**edad**" (age), "**createdAt**" and "**updatedAt**".

### cuentahabientecuentas

This table handles the many-to-many relationships between accounts and account holders. Its fields are "**id**", "**cuentahabienteId**" (this has to be the account holder's actual real "id", not the "claveCuentahabiente"), "**cuentumId**" (this has to be the account's actual real "id", not the "claveCuenta"; this field in theory should be named "cuentaId" but it seems Sequelize's naming strategy detected the word "cuenta" as Latin instead of Spanish), "**createdAt**" and "**updatedAt**".

### sequelizemeta

This table is created automatically by Sequelize after migrating the tables from the [migrations](migrations) folder. This table's only purpose is for Sequelize to keep track of the migrations that have ran on the database.

## Routes for HTTP requests

All HTTP requests to this API return JSON objects (except for `GET /`, which returns a string, and `GET /cuentas/:id/saldo`, which returns a number). All the POST, PUT and PATCH requests require JSON objects as their payload bodies.

NOTE: "id" in the payload body JSONs of the PUT requests refer to "claveCuenta" and "claveCuentahabiente" in the MySQL tables, not the fields literally called "id" from those tables. Giving the **cuenta** and **cuentahabientes** tables an "id" field and separate "claveCuenta"/"claveCuentahabiente" fields was a request from my professor, but for the sake of simplicity I decided to shorten both to just "id" in the JSONs that have to be sent in PUT requests.

### No token required

#### To get the API instructions: `GET /`
Returns a string.

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
***NOTE: You can only delete account holders that aren't associated to any account.***

#### Create a new account (cuenta): `POST /cuentas`
Body ("id" has to be a non-0 and non-negative integer; "saldo" has to be a non-negative number, it will always be rounded to 2 decimal spaces; "cuentahabientes" has to be an array that contains the "claveCuentahabiente" of at least 1 account holder to associate):
```
{
  "id": number,
  "saldo": number,
  "cuentahabientes": [number(s)]
}
```
Response (the same new cuenta that was just registered but as it shows up in MySQL):
```
{
  "id": number,
  "claveCuenta": number,
  "saldo": number,
  "createdAt": string,
  "updatedAt": string
}
```

#### Get all accounts: `GET /cuentas`
Response (an array of JSONs with the following format):
```
{
  "claveCuenta": number,
  "saldo": number,
  "cuentahabientes": array of JSONs with the following format
              {
                "claveCuentahabiente": number,
                "nombre": string,
                "edad": number
              }
}
```
The response will be an empty array if there are no accounts.
The array of "cuentahabientes" will be empty if there are no account holders associated to that specific account.

#### Get a specific account by its id (claveCuenta): `GET /cuentas/:id`
Response:
```
{
  "claveCuenta": number,
  "saldo": number,
  "cuentahabientes": array of JSONs with the following format
              {
                "claveCuentahabiente": number,
                "nombre": string,
                "edad": number
              }
}
```
The array of "cuentahabientes" will be empty if there are no account holders associated.

#### Get the balance of a specific account by its id (claveCuenta): `GET /cuentas/:id/saldo`
Returns a number.

#### Deposit money to the balance of an account specified by its id (claveCuenta): `PATCH /cuentas/:id/deposito`
Body ("deposito" has to be a non-0 and non-negative number; it will always be rounded to 2 decimal spaces):
```
{
  "deposito": number
}
```
Response (the account on which the deposit was made):
```
{
  "id": number,
  "claveCuenta": number,
  "saldo": number,
  "createdAt": string,
  "updatedAt": string
}
```

#### Withdraw money from the balance of an account specified by its id (claveCuenta): `PATCH /cuentas/:id/retiro`
Body ("retiro" has to be a non-0 and non-negative number; it will always be rounded to 2 decimal spaces):
```
{
  "retiro": number
}
```
Response (the account from which the withdrawal was made):
```
{
  "id": number,
  "claveCuenta": number,
  "saldo": number,
  "createdAt": string,
  "updatedAt": string
}
```

#### Transfer money from an account of a specific idFuente (claveCuenta) to an account of a specific idDestino (claveCuenta): `PATCH /cuentas/:idFuente/transferencia/:idDestino`
Body ("transferencia" has to be a non-0, non-negative number that also isn't greater than the source account's available balance; it will always be rounded to 2 decimal spaces):
```
{
  "transferencia": number
}
```
Response (an array that contains both accounts involved in the transfer, starting with the source account):
```
[
  {
    "id": number,
    "claveCuenta": number,
    "saldo": number,
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

#### Delete a specific account by its id (claveCuenta): `DELETE /cuentas/:id`
Response (the account that was just deleted):
```
{
  "id": number,
  "claveCuenta": number,
  "saldo": number,
  "createdAt": string,
  "updatedAt": string
}
```
***NOTE: You can only delete accounts that have a balance of $0.***
