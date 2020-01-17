var express = require('express');
var router = express.Router();
const imagenController = require('../controllers/imagen.controller');

// Peticiones GET
router.get('/:tipo/:img', imagenController.verImagen); // Obtener todos lo hospitales

module.exports = router;
