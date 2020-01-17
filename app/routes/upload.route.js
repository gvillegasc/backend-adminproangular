var express = require('express');
var router = express.Router();
const uploadController = require('../controllers/upload.controller');
var fileUpload = require('express-fileupload');

// Middlerware para poder subir archivo
router.use(fileUpload());

// Peticiones PUT
router.put('/:tipo/:id', uploadController.subirArchivo); // Subir archivo al servidor

module.exports = router;
