const express = require('express');
const { registrarUsuario, confirmarCodigo } = require('../controllers/registroUserController.js');

const router = express.Router();

router.post('/registrar.html', registrarUsuario);
router.post('/registrar.html/codigo', confirmarCodigo);

module.exports = router;
