var Usuario = require('../models/usuario.model');
var bcrypt = require('bcryptjs');
var usuarioMiddleware = require('../middlewares/usuario.middleware');

// Google
const { OAuth2Client } = require('google-auth-library');
var CLIENT_ID =
	'677013130041-n9te9v1muno95aqi7khnpmbcumaup1pg.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: CLIENT_ID
	});
	const payload = ticket.getPayload();
	// console.log(payload);
	return {
		nombre: payload.name,
		email: payload.email,
		img: payload.picture,
		google: true
	};
}
module.exports = {
	iniciarSesionGoogle: async (req, res, next) => {
		var token = req.body.token;
		var googleUser = await verify(token).catch(e => {
			return res.status(403).json({
				ok: false,
				mensaje: 'Token no válido',
				errors: e
			});
		});

		Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					mensaje: 'Error al buscar usuario',
					errors: err
				});
			}
			if (usuarioDB) {
				if (usuarioDB.google === false) {
					return res.status(400).json({
						ok: false,
						mensaje: 'Debe de usar su autenticación normal',
						errors: err
					});
				} else {
					// Funcion para iniciar sesion
					var token = usuarioMiddleware.generarToken(usuarioDB); // Crear un JWT
					res.status(200).json({
						ok: true,
						usuario: usuarioDB,
						token: token,
						id: usuarioDB._id
					});
				}
			} else {
				//El usuario no existe por eso se tiene que crear
				var usuario = new Usuario();
				usuario.nombre = googleUser.nombre;
				usuario.email = googleUser.email;
				usuario.img = googleUser.img;
				usuario.google = true;
				usuario.password = ':)';

				usuario.save((err, usuarioDB) => {
					var token = usuarioMiddleware.generarToken(usuarioDB); /// Crear un JWT
					res.status(200).json({
						ok: true,
						usuario: usuarioDB,
						token: token,
						id: usuarioDB._id
					});
				});
			}
		});
		// return res.status(200).json({
		// 	ok: true,
		// 	mensaje: 'Login correcto',
		// 	googleUser
		// });
	},
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

			usuarioDB.password = ':)';
			var token = usuarioMiddleware.generarToken(usuarioDB); /// Crear un JWT
			res.status(200).json({
				ok: true,
				token: token,
				usuario: usuarioDB,
				id: usuarioDB._id
			});
		});
	},
	listarAllUsuarios: (req, res, next) => {
		var desde = req.query.desde || 0;
		desde = Number(desde);
		Usuario.find({}, 'nombre email img role google')
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
				Usuario.countDocuments({}, (err, conteo) => {
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
			// img: usuarioBody.img,
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
