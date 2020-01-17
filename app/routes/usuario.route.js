var express = require('express');
var router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
var usuarioMiddleware = require('../middlewares/usuario.middleware');

// Peticiones GET
router.get('/', usuarioController.listarAllUsuarios); // Obtener todos lo usuarios

// Peticiones POST
router.post(
	'/',
	usuarioMiddleware.verificarToken,
	usuarioController.crearUsuario
); // Crear un nuevo usuario
router.post('/iniciarSesion', usuarioController.iniciarSesion); // Login de usuario

// Peticiones PUT
router.put(
	'/:idUsuario',
	usuarioMiddleware.verificarToken,
	usuarioController.actualizarUsuario
); // Actualizar usuario

// Peticiones DELETE
router.delete(
	'/:idUsuario',
	usuarioMiddleware.verificarToken,
	usuarioController.borrarUsuario
); // Eliminar usuario

module.exports = router;
