var Medico = require('../models/medico.model');
var usuarioMiddleware = require('../middlewares/usuario.middleware');

module.exports = {
	listaAllMedicos: (req, res, next) => {
		var desde = req.query.desde || 0;
		desde = Number(desde);
		Medico.find({})
			.populate('usuario', 'nombre email')
			.populate('hospital')
			.skip(desde)
			.limit(5)
			.exec((err, medicos) => {
				if (err) {
					return res.status(500).json({
						ok: false,
						mensaje: 'Error cargando medioc',
						errors: err
					});
				}
				Medico.countDocuments({}, (err, conteo) => {
					res.status(200).json({
						ok: true,
						totalMedicos: conteo,
						medicos
					});
				});
			});
	},
	crearMedico: (req, res, next) => {
		var medicoBody = req.body;
		var medico = new Medico({
			nombre: medicoBody.nombre,
			img: medicoBody.img,
			// usuario: medicoBody.usuario,
			usuario: req.usuario._id,
			hospital: medicoBody.hospital
		});
		medico.save((err, medicoGuardado) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					mensaje: 'Error al crear medico',
					errors: err
				});
			}
			res.status(201).json({
				ok: true,
				medico: medicoGuardado
			});
		});
	},
	actualizarMedico: (req, res, next) => {
		var idMedico = req.params.idMedico;
		var medicoBody = req.body;
		Medico.findById(idMedico, (err, medico) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					mensaje: 'Error al buscar medico',
					errors: err
				});
			}
			if (!medico) {
				return res.status(500).json({
					ok: false,
					mensaje: 'El medico con el id' + idMedico + 'no existe',
					errors: { message: 'No existe un medico con ese ID' }
				});
			}
			medico.nombre = medicoBody.nombre;
			medico.img = medicoBody.img;
			medico.usuario = medicoBody.usuario;
			medico.hospital = medicoBody.hospital;
			medico.save((err, medicoGuardado) => {
				if (err) {
					return res.status(400).json({
						ok: false,
						mensaje: 'Error al actualizar medico',
						errors: err
					});
				}
				res.status(200).json({
					ok: true,
					medico: medicoGuardado
				});
			});
		});
	},
	borrarMedico: (req, res, next) => {
		var idMedico = req.params.idMedico;
		Medico.findByIdAndRemove(idMedico, (err, medicoBorrado) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					mensaje: 'Error al borrar medico',
					errors: err
				});
			}
			if (!medicoBorrado) {
				return res.status(400).json({
					ok: false,
					mensaje: 'No existe un medico con ese id',
					errors: err
				});
			}
			res.status(200).json({
				ok: true,
				usuario: medicoBorrado
			});
		});
	}
};
