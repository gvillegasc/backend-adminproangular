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
	}
};
