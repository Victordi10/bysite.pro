const express = require('express');
const session = require('express-session');
const router = express.Router();
const {actualizarLogoNegocio, actualizarNegocio, actualizarCatalogo, eliminarNegocios, obtenerNegocios, verificarCantidadNegocios,crearNegocios, panel,cerrarSesion, enviarTipografias,verificaSesionFron, guardarSubdominio,validarSubdominio,enviarTiposNegocios,eliminarFotoPortada} = require('../controllers/negocioController.js');
const { verificarSesion } = require('../middlewares/verificarSesion.js');
const {upload,optimizeAndSaveImage,guardarFotoPortada} = require('../models/uploadNegocio.js')


router.use(express.json())
//configuro session
router.use(session({
    secret: process.env.SESSION_SECRET, // Clave secreta para firmar la cookie de sesión
    resave: false,
    saveUninitialized: true
}));

//logica para cerrar sesion
router.get("/panel.html/cerrar",cerrarSesion)

//frontend verifica session//logica para cerrar sesion
router.get("/panel.html/verificar-sesion",verificaSesionFron)

//cargo los tipos de negocios
router.get("/panel.html/obtener-tipos-negocios",enviarTiposNegocios)

//sirvo pagina de administrar negocios
//llevo el panel al navegador
router.get('/panel.html/:id_unico', verificarSesion,panel);

//cargo las tipografias
router.get('/panel.html/:id_unico/tipografias', verificarSesion,enviarTipografias);

router.post('/:id_unico/panel.html/agregar', verificarSesion, upload.single('negocioLogo'), optimizeAndSaveImage, crearNegocios);
//verifico si puedo crear mas negocios antes de poder llenar el formulario
router.get("/panel.html/negocios/verificar/:id_unico_dueno",verificarCantidadNegocios)

//obtengo los negocios
router.get('/panel.html/negocios/obtener',verificarSesion,obtenerNegocios)

//logica para eliminar negocios por id y el id_unico para borrar los archivos y el nombre de la tabla para eliminar la tabla de negocio
router.delete("/:id_unico_dueno/:negocioNombre/:negocio_id/eliminar",verificarSesion, eliminarNegocios)

//logica para actualizar el negocio 
router.put("/:id_unico_dueno/:negocioNombre/:idNegocios/actualizarInfo",actualizarNegocio)
//actualizar el catalogo
router.put("/:id_unico_dueno/:negocioNombre/:idNegocios/actualizarCatalogo",actualizarCatalogo)

//guarda el subdominio
router.put("/actualizar-subdominio/:id_unico_dueno/:negocioID",guardarSubdominio)
//verifica el subdominio
router.post("/verificar-subdominio/:negocioID",validarSubdominio)

//logica para actualizar el logo del negocio
//actualizar logo
router.put("/:id_unico_dueno/:negocioNombre/:negocioID/negocioLogo", upload.single('actualizarArchivo_input'),optimizeAndSaveImage, actualizarLogoNegocio);
//imagen de portada
router.put("/:id_unico_dueno/:negocioNombre/:negocioID/catalogoFoto", upload.single('actualizarArchivo_input'),guardarFotoPortada);

//elimino la foto de portada
router.delete("/:id_unico_dueno/:negocioNombre/:negocioID/borrarFotoPortada",eliminarFotoPortada);




module.exports =  router;