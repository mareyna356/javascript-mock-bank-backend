const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const https = require('https');

const port = 4001;

const llavePrivada = fs.readFileSync('private.key');
const certificado = fs.readFileSync('certificate.crt');
const credenciales = {
	key: llavePrivada,
	cert: certificado,
	passphrase: "password"
};
const httpsServer = https.createServer(credenciales, app);

const router = require('./router');
const passport = require('./auth/passport');

//Middleware - Procesan datos antes de que el server los reciba
app.use(passport.initialize());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router);

//Establece el puerto a escuchar
httpsServer.listen(port, () => {
	console.log('Servidor https iniciado en puerto:', port);
}).on('error', err => {
	console.log('Error:', err);
});

//Maneja los casos de URLs que no existen
app.use((req, res) => {
	res.status(404).json({
		type: 'error',
		status: 404,
		msg: 'Acción no válida en este URL.'
	});
});