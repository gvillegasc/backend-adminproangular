var Hospital = require('../models/hospital.model');

module.exports = {
	listaAllHospitales: (req, res, next) => {
		var desde = req.query.desde || 0;
		desde = Number(desde);
		Hospital.find({})
			.populate('usuario', 'nombre email')
			.skip(desde)
			.limit(5)
			.exec((err, hospitales) => {
				if (err) {
					return res.status(500).json({
						ok: false,
						mensaje: 'Error cargando hospitales',
						errors: err
					});
				}
				Hospital.countDocuments({}, (err, conteo) => {
					res.status(200).json({
						ok: true,
						totalHospitales: conteo,
						hospitales
					});
				});
			});
	},
	listarHospital: (req, res, next) => {
		var idHospital = req.params.idHospital;
		Hospital.findById(idHospital)
			.populate('usuario', 'nombre img email')
			.exec((err, hospital) => {
				if (err) {
					return res.status(500).json({
						ok: false,
						mensaje: 'Error al buscar hospital',
						errors: err
					});
				}
				if (!hospital) {
					return res.status(400).json({
						ok: false,
						mensaje: 'EL hospital con el id' + idHospital + 'no existe',
						errors: { message: 'No existe un hospital' }
					});
				}
				res.status(200).json({
					ok: true,
					hospital
				});
			});
	},

	crearHospital: (req, res, next) => {
		var hospitalBody = req.body;
		var hospital = new Hospital({
			nombre: hospitalBody.nombre,
			img: hospitalBody.img,
			usuario: req.usuario._id
			//usuario: hospitalBody.usuario
		});
		hospital.save((err, hospitalGuardado) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					mensaje: 'Error al crear hospital',
					errors: err
				});
			}
			res.status(201).json({
				ok: true,
				hospital: hospitalGuardado
			});
		});
	},
	actualizarHospital: (req, res, next) => {
		var idHospital = req.params.idHospital;
		var hospitalBody = req.body;
		Hospital.findById(idHospital, (err, hospital) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					mensaje: 'Error al buscar hospital',
					errors: err
				});
			}
			if (!hospital) {
				return res.status(500).json({
					ok: false,
					mensaje: 'El hospital con el id' + idHospital + 'no existe',
					errors: { message: 'No existe un hospital con ese ID' }
				});
			}
			hospital.nombre = hospitalBody.nombre;
			hospital.img = hospitalBody.img;
			hospital.usuario = hospitalBody.usuario;
			hospital.save((err, hospitalGuardado) => {
				if (err) {
					return res.status(400).json({
						ok: false,
						mensaje: 'Error al actualizar hospital',
						errors: err
					});
				}
				res.status(200).json({
					ok: true,
					hospital: hospitalGuardado
				});
			});
		});
	},
	borrarHospital: (req, res, next) => {
		var idHospital = req.params.idHospital;
		Hospital.findByIdAndRemove(idHospital, (err, hospitalBorrado) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					mensaje: 'Error al borrar hospital',
					errors: err
				});
			}
			if (!hospitalBorrado) {
				return res.status(400).json({
					ok: false,
					mensaje: 'No existe un hospital con ese id',
					errors: err
				});
			}
			res.status(200).json({
				ok: true,
				usuario: hospitalBorrado
			});
		});
	}
};
