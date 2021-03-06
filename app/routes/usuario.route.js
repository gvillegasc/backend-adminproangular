var express = require('express');
var router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
var usuarioMiddleware = require('../middlewares/usuario.middleware');

// Peticiones GET
router.get('/', usuarioController.listarAllUsuarios); // Obtener todos lo usuarios
router.get(
	'/renovarToken',
	[usuarioMiddleware.verificarToken],
	usuarioController.renovarToken
);

// Peticiones POST
router.post('/', usuarioController.crearUsuario); // Crear un nuevo usuario

router.post('/iniciarSesion', usuarioController.iniciarSesion); // Login de usuario
router.post('/iniciarSesionGoogle', usuarioController.iniciarSesionGoogle); // Login de usuario

// Peticiones PUT
router.put(
	'/:idUsuario',
	[usuarioMiddleware.verificarToken, usuarioMiddleware.verificarRoleoUsuario],
	usuarioController.actualizarUsuario
); // Actualizar usuario

// Peticiones DELETE
router.delete(
	'/:idUsuario',
	[usuarioMiddleware.verificarToken, usuarioMiddleware.verificarRole],
	usuarioController.borrarUsuario
); // Eliminar usuario

module.exports = router;
