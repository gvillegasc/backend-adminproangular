var express = require('express');
var router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
var utils = require('../middlewares/utils.middleware');

// Peticiones GET
router.get('/', usuarioController.listarAllUsuarios); // Obtener todos lo usuarios

// Peticiones POST
router.post('/', utils.verificarToken, usuarioController.crearUsuario); // Crear un nuevo usuario
router.post('/iniciarSesion', usuarioController.iniciarSesion); // Login de usuario

// Peticiones PUT
router.put(
	'/:idUsuario',
	utils.verificarToken,
	usuarioController.actualizarUsuario
); // Editar usuario

// Peticiones DELETE
router.delete(
	'/:idUsuario',
	utils.verificarToken,
	usuarioController.borrarUsuario
); // Eliminar usuario

module.exports = router;
