const express = require('express');
const {upload, optimizeAndSaveImage} = require('../models/uploadProductos')

const { 
    getHtmlNegocio,
    getDatosPerfilNegocio,
    getProductosNegocio,
    agregarProducto,
    verificarCanProductos,
    actualizarFotoProducto,
    actualizarDetallesProducto,
    eliminarProductos
} = require('../controllers/productosController.js');

const router = express.Router();
router.use(express.json());

router.get("/:id_unico_dueno", getHtmlNegocio);

router.get("/:id_unico_dueno/:negocioNombre/datos", getDatosPerfilNegocio);

router.get("/:negocio_id/:id_unico_dueno/:negocioNombre/productos", getProductosNegocio);

router.post("/:negocio_id/:id_unico_dueno/:negocioNombre/:productoNombre/agregar", upload.single('productoFoto'),optimizeAndSaveImage, agregarProducto);

router.get("/:negocio_id/:id_unico_dueno/:negocioNombre/verificarCan-productos",verificarCanProductos)

router.put("/:negocio_id/:id_unico_dueno/:negocioNombre/:productoNombre/editarFoto", upload.single('actualizarArchivo_input'), optimizeAndSaveImage, actualizarFotoProducto);

router.put("/:negocio_id/:id_unico_dueno/:negocioNombre/:productoNombre/editarDetalles", actualizarDetallesProducto);

router.delete("/:negocio_id/:id_unico_dueno/:negocioNombre/:productoNombre/:producto_id/eliminar", eliminarProductos);

module.exports = router;
