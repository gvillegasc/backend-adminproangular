module.exports = {
	funciona: (req, res, next) => {
		res.status(200).json({
			ok: true,
			mensaje: 'Bienvenido a nuestra api!'
		});
	}
};
