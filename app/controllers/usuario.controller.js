var Usuario = require('../models/usuario.model');
var bcrypt = require('bcryptjs');
var usuarioMiddleware = require('../middlewares/usuario.middleware');

module.exports = {
	iniciarSesion: (req, res, next) => {
		var usuarioBody = req.body;
		Usuario.findOne({ email: usuarioBody.email }, (err, usuarioDB) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					mensaje: 'Error al buscar usuario',
					errors: err
				});
			}
			if (!usuarioDB) {
				return res.status(400).json({
					ok: false,
					mensaje: 'Credenciales incorrectas'
				});
			}
			if (!bcrypt.compareSync(usuarioBody.password, usuarioDB.password)) {
				return res.status(400).json({
					ok: false,
					mensaje: 'Credenciales incorrectas'
				});
			}
			var token = usuarioMiddleware.generarToken(usuarioDB); /// Crear un JWT
			res.status(200).json({
				ok: true,
				token: token,
				id: usuarioDB._id
			});
		});
	},
	listarAllUsuarios: (req, res, next) => {
		var desde = req.query.desde || 0;
		desde = Number(desde);
		Usuario.find({}, 'nombre email img role')
			.skip(desde)
			.limit(5)
			.exec((err, usuarios) => {
				if (err) {
					return res.status(500).json({
						ok: false,
						mensaje: 'Error cargando usuarios',
						errors: err
					});
				}
				Usuario.count({}, (err, conteo) => {
					res.status(200).json({
						ok: true,
						totalUsuarios: conteo,
						usuarios
					});
				});
			});
	},
	crearUsuario: (req, res, next) => {
		var usuarioBody = req.body;
		var usuario = new Usuario({
			nombre: usuarioBody.nombre,
			email: usuarioBody.email,
			password: bcrypt.hashSync(usuarioBody.password, 10),
			img: usuarioBody.img,
			role: usuarioBody.role
		});
		usuario.save((err, usuarioGuardado) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					mensaje: 'Error al crear usuario',
					errors: err
				});
			}
			usuarioGuardado.password = ':)';
			res.status(201).json({
				ok: true,
				usuario: usuarioGuardado
			});
		});
	},
	actualizarUsuario: (req, res, next) => {
		var idUsuario = req.params.idUsuario;
		var usuarioBody = req.body;
		Usuario.findById(idUsuario, (err, usuario) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					mensaje: 'Error al buscar usuario',
					errors: err
				});
			}
			if (!usuario) {
				return res.status(500).json({
					ok: false,
					mensaje: 'El usuario con el id' + idUsuario + 'no existe',
					errors: { message: 'No existe un usuario con ese ID' }
				});
			}
			usuario.nombre = usuarioBody.nombre;
			usuario.email = usuarioBody.email;
			usuario.role = usuarioBody.role;
			usuario.save((err, usuarioGuardado) => {
				if (err) {
					return res.status(400).json({
						ok: false,
						mensaje: 'Error al actualizar usuario',
						errors: err
					});
				}
				usuarioGuardado.password = ':)';
				res.status(200).json({
					ok: true,
					usuario: usuarioGuardado
				});
			});
		});
	},
	borrarUsuario: (req, res, next) => {
		var idUsuario = req.params.idUsuario;
		Usuario.findByIdAndRemove(idUsuario, (err, usuarioBorrado) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					mensaje: 'Error al borrar usuario',
					errors: err
				});
			}
			if (!usuarioBorrado) {
				return res.status(400).json({
					ok: false,
					mensaje: 'No existe un usuario con ese id',
					errors: err
				});
			}
			res.status(200).json({
				ok: true,
				usuario: usuarioBorrado
			});
		});
	}
};
