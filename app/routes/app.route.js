var express = require('express');
var router = express.Router();
const appController = require('../controllers/app.controller');

// Peticiones GET
router.get('/', appController.funciona); // Obtener todos lo hospitales

module.exports = router;
