const {buscadorAdmin} = require('../controllers/buscadorController.js');
const {verificarSesion} = require('../middlewares/verificarSesion.js')
const express = require('express');
const router = express.Router();

router.get('/:id_unico_dueno/:negocio/:idNegocio/buscador/', verificarSesion, buscadorAdmin);

module.exports = router;

