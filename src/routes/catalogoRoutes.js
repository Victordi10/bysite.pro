const express = require('express');
const router = express.Router();
const { mostrarPaginaCatalogo, obtenerDatosCatalogo } = require('../controllers/catalogoController.js');

// Ruta para mostrar la página de venta del catálogo
router.get("/negocio/:negocioNombre/:idNegocio/catalogo", mostrarPaginaCatalogo);

// Ruta para obtener los datos del catálogo
router.get("/:negocioNombre/:idNegocio/catalogo/datos", obtenerDatosCatalogo);

module.exports = router;
