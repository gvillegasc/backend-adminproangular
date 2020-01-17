var express = require('express');
var router = express.Router();
const medicoController = require('../controllers/medico.controller');
var usuarioMiddleware = require('../middlewares/usuario.middleware');

// Peticiones GET
router.get('/', medicoController.listaAllMedicos); // Obtener todos los medicos

// Peticiones POST
router.post(
	'/',
	usuarioMiddleware.verificarToken,
	medicoController.crearMedico
); // Crear un nuevo medico

// Peticiones PUT
router.put(
	'/:idMedico',
	usuarioMiddleware.verificarToken,
	medicoController.actualizarMedico
); // Actualizar medico

// Peticiones DELETE
router.delete(
	'/:idMedico',
	usuarioMiddleware.verificarToken,
	medicoController.borrarMedico
); // Eliminar medico

module.exports = router;
