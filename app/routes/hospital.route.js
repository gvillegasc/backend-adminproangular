var express = require('express');
var router = express.Router();
const hospitalController = require('../controllers/hospital.controller');
var usuarioMiddleware = require('../middlewares/usuario.middleware');

// Peticiones GET
router.get('/', hospitalController.listaAllHospitales); // Obtener todos lo hospitales

// Peticiones POST
router.post(
	'/',
	usuarioMiddleware.verificarToken,
	hospitalController.crearHospital
); // Crear un nuevo hospital

// Peticiones PUT
router.put(
	'/:idHospital',
	usuarioMiddleware.verificarToken,
	hospitalController.actualizarHospital
); // Actualizar hospital

// Peticiones DELETE
router.delete(
	'/:idHospital',
	usuarioMiddleware.verificarToken,
	hospitalController.borrarHospital
); // Eliminar hospital

module.exports = router;
