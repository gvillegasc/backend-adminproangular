// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

// Inicializar variables
var app = express();

// Body Parse configuracion
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importación de CORS
app.use('/', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization, Content-Length, X-Requested-With'
	);
	next();
});

// Conexion a la base de datos
mongoose.connection.openUri(
	'mongodb://localhost:27017/hospitalDB',
	{
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false
	},
	(err, res) => {
		if (err) throw err;
		console.log('Base de datos: \x1b[32m%s\x1b[0m', ' online!');
	}
);
mongoose.set('useNewUrlParser', true);

// Server index config - ver imagen en el navegador
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/app/uploads', serveIndex(__dirname + '/app/uploads'));

// Importar rutas
var appRouter = require('./app/routes/app.route');
var usuarioRouter = require('./app/routes/usuario.route');
var hospitalRouter = require('./app/routes/hospital.route');
var medicoRouter = require('./app/routes/medico.route');
var buscadorRouter = require('./app/routes/buscador.route');
var uploadRouter = require('./app/routes/upload.route');
var imagenRouter = require('./app/routes/imagen.route');

// Rutas
app.use('/', appRouter);
app.use('/usuario', usuarioRouter);
app.use('/hospital', hospitalRouter);
app.use('/medico', medicoRouter);
app.use('/buscador', buscadorRouter);
app.use('/upload', uploadRouter);
app.use('/imagen', imagenRouter);

// Escuchar peticiones
app.listen(port, () => {
	console.log(
		'Express server puerto ' + port + ': \x1b[32m%s\x1b[0m',
		' online!'
	);
});
