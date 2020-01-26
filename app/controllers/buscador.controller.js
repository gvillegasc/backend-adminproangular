var Hospital = require('../models/hospital.model');
var Medico = require('../models/medico.model');
var Usuario = require('../models/usuario.model');

module.exports = {
	buscarTodo: (req, res, next) => {
		var busqueda = req.params.busqueda;
		var regex = new RegExp(busqueda, 'i'); // ==> " /dato/i ""
		Promise.all([
			buscarHospitales(regex),
			buscarMedicos(regex),
			buscarUsuarios(regex)
		]).then(respuestas => {
			res.status(200).json({
				ok: true,
				hospitales: respuestas[0],
				medicos: respuestas[1],
				usuarios: respuestas[2]
			});
		});
	},
	buscarColeccion: (req, res, next) => {
		var tabla = req.params.tabla;
		var busqueda = req.params.busqueda;
		var regex = new RegExp(busqueda, 'i'); // ==> " /dato/i ""
		var promesa;

		switch (tabla) {
			case 'usuarios':
				promesa = buscarUsuarios(regex);
				break;
			case 'medicos':
				promesa = buscarMedicos(regex);
				break;
			case 'hospitales':
				promesa = buscarHospitales(regex);
				break;
			default:
				return res.status(400).json({
					ok: false,
					mensaje:
						'Los tipos de busqueda solo son: usuarios, medicos y hospitales',
					error: { message: 'Tipo de coleccion no valido' }
				});
		}
		promesa.then(respuesta => {
			res.status(200).json({
				ok: true,
				[tabla]: respuesta
			});
		});
	}
};

function buscarHospitales(regex) {
	return new Promise((resolve, reject) => {
		Hospital.find({ nombre: regex })
			.populate('usuario', 'nombre email img')
			.exec((err, hospitales) => {
				if (err) {
					reject('Error al carga hospitales', err);
				}
				resolve(hospitales);
			});
	});
}

function buscarMedicos(regex) {
	return new Promise((resolve, reject) => {
		Medico.find({ nombre: regex })
			.populate('usuario', 'nombre email img')
			.populate('hospital')
			.exec((err, medicos) => {
				if (err) {
					reject('Error al carga medicos', err);
				}
				resolve(medicos);
			});
	});
}

function buscarUsuarios(regex) {
	return new Promise((resolve, reject) => {
		Usuario.find({}, 'nombre email role img')
			.or([{ nombre: regex }, { email: regex }])
			.exec((err, usuarios) => {
				if (err) {
					reject('Error al cargar usuario', err);
				}
				resolve(usuarios);
			});
	});
}
