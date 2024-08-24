const { crearCategoria, 
        actualizarCategoria,
        EliminarCategoria, 
        editarCategoria ,
        recomendarProducto,
        noRecomendarProducto,
        destacarProducto,
        noDestacarProducto} = require('../controllers/categoriasController.js');

const { verificarSesion } = require('../middlewares/verificarSesion.js');
const express = require('express');
const router = express.Router();

router.post("/:idNegocios/:negocioNombre/agregar-categoria", crearCategoria);
router.put("/:idNegocios/:negocioNombre/renombrar-categoria", actualizarCategoria);
router.put("/:idNegocios/:negocioNombre/editar-categoria", editarCategoria);
router.put("/:idNegocios/:negocioNombre/editar-categoria", editarCategoria);
router.delete("/:idNegocios/:negocioNombre/eliminar-categoria", EliminarCategoria);

//sub categorias
router.put('/recomendar/:idNegocio', recomendarProducto);
router.put('/no-recomendar/:idNegocio', noRecomendarProducto);
router.put('/destacar/:idNegocio', destacarProducto);
router.put('/no-destacar/:idNegocio', noDestacarProducto);

module.exports = router;
