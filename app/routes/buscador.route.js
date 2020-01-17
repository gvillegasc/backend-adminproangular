var express = require('express');
var router = express.Router();
const buscadorController = require('../controllers/buscador.controller');

// Peticiones GET
router.get('/todo/:busqueda', buscadorController.buscarTodo); // Obtener todos lo hospitales
router.get('/coleccion/:tabla/:busqueda', buscadorController.buscarColeccion); // Obtener todos lo hospitales

module.exports = router;
