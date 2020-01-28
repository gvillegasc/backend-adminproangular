const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'secret-word';

module.exports = {
	generarToken: usuario => {
		const u = {
			_id: usuario._id,
			nombre: usuario.nombre,
			email: usuario.email,
			role: usuario.role
		};
		return (token = jwt.sign(u, process.env.JWT_SECRET, {
			expiresIn: 14400 //Expires in 4 hours
		}));
	},
	verificarToken: (req, res, next) => {
		var token = req.query.token;
		// console.log(token);
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				return res.status(401).json({
					ok: false,
					mensaje: 'Token invalido',
					errors: err
				});
			}
			//++++++++++++++++++++++++++++++++++++++++++++
			// console.log(decoded);
			//++++++++++++++++++++++++++++++++++++++++++++
			req.usuario = decoded;

			next();
		});
	},
	verificarRole: (req, res, next) => {
		var usuario = req.usuario;
		if (usuario.role == 'ADMIN_ROLE') {
			next();
			return;
		} else {
			return res.status(401).json({
				ok: false,
				mensaje: 'Token incorrecto no es administrado'
			});
		}
	},
	verificarRoleoUsuario: (req, res, next) => {
		var usuario = req.usuario;
		var idUsuario = req.params.idUsuario;
		if (usuario.role === 'ADMIN_ROLE' || usuario._id === idUsuario) {
			next();
			return;
		} else {
			return res.status(401).json({
				ok: false,
				mensaje: 'Token incorrecto no es administrado ni es el mismo usuario'
			});
		}
	}
};
