// Imporatación de fileSystem
var fs = require('fs');

// Importación de modelos
var Usuario = require('../models/usuario.model');
var Medico = require('../models/medico.model');
var Hospital = require('../models/hospital.model');

module.exports = {
	subirArchivo: (req, res, next) => {
		var tipo = req.params.tipo;
		var id = req.params.id;
		// Tipos de colecciones
		var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
		if (tiposValidos.indexOf(tipo) < 0) {
			return res.status(400).json({
				ok: false,
				mensaje: 'Tipo de colección no es válida',
				errors: { message: 'Tipo de colección no es válida' }
			});
		}
		if (!req.files) {
			return res.status(400).json({
				ok: false,
				mensaje: 'No se selecciono nada',
				errors: { message: 'Debe seleccionar una imagen' }
			});
		}
		// Obtener nombre del archivo
		var archivo = req.files.imagen;
		var nombreCortado = archivo.name.split('.');
		var extensionArchivo = nombreCortado[nombreCortado.length - 1];

		// Solo estas extensiones aceptamos
		var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
		if (extensionesValidas.indexOf(extensionArchivo) < 0) {
			return res.status(400).json({
				ok: false,
				mensaje: 'Extension no válida',
				errors: {
					message:
						'Las extensiones válidas son ' + extensionesValidas.join(', ')
				}
			});
		}

		// Cambiar el nombre del archivo
		var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

		// Mover el archivo del temporal al path
		var path = `./app/uploads/${tipo}/${nombreArchivo}`;
		archivo.mv(path, err => {
			if (err) {
				return res.status(500).json({
					ok: false,
					mensaje: 'Error al mover archivo',
					errors: err
				});
			}
			subirPorTipo(tipo, id, nombreArchivo, res);
		});
	}
};

function subirPorTipo(tipo, id, nombreArchivo, res) {
	if (tipo === 'usuarios') {
		Usuario.findById(id, (err, usuario) => {
			if (!usuario) {
				return res.status(400).json({
					ok: true,
					mensaje: 'Usuario no existe',
					errors: { message: 'Usuario no existe' }
				});
			}

			var pathViejo = `./app/uploads/usuarios/${usuario.img}`;

			// Si existe, elimina la imagen anterior
			if (fs.existsSync(pathViejo)) {
				fs.unlinkSync(pathViejo);
			}

			usuario.img = nombreArchivo;

			usuario.save((err, usuarioActualizado) => {
				usuarioActualizado.password = ':)';

				return res.status(200).json({
					ok: true,
					mensaje: 'Imagen de usuario actualizada',
					usuario: usuarioActualizado
				});
			});
		});
	}
	if (tipo === 'medicos') {
		Medico.findById(id, (err, medico) => {
			if (!medico) {
				return res.status(400).json({
					ok: true,
					mensaje: 'Médico no existe',
					errors: { message: 'Médico no existe' }
				});
			}

			var pathViejo = `./app/uploads/medicos/${medico.img}`;

			// Si existe, elimina la imagen anterior
			if (fs.existsSync(pathViejo)) {
				fs.unlinkSync(pathViejo);
			}

			medico.img = nombreArchivo;

			medico.save((err, medicoActualizado) => {
				return res.status(200).json({
					ok: true,
					mensaje: 'Imagen de médico actualizada',
					usuario: medicoActualizado
				});
			});
		});
	}
	if (tipo === 'hospitales') {
		Hospital.findById(id, (err, hospital) => {
			if (!hospital) {
				return res.status(400).json({
					ok: true,
					mensaje: 'Hospital no existe',
					errors: { message: 'Hospital no existe' }
				});
			}

			var pathViejo = `./app/uploads/hospitales/${hospital.img}`;

			// Si existe, elimina la imagen anterior
			if (fs.existsSync(pathViejo)) {
				fs.unlinkSync(pathViejo);
			}

			hospital.img = nombreArchivo;

			hospital.save((err, hospitalActualizado) => {
				return res.status(200).json({
					ok: true,
					mensaje: 'Imagen de hospital actualizada',
					usuario: hospitalActualizado
				});
			});
		});
	}
}
