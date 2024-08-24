const express = require('express');
const router = express.Router();
const { login,verificarUsuario,verificarToken,cambiarContraseña } = require('../controllers/loginController.js');
const session = require('express-session')

router.use(express.json())
router.use(session({
    secret: 'mi_secreto', // Clave secreta para firmar la cookie de sesión
    resave: false,
    saveUninitialized: true
}));


router.post('/login.html', login);
router.post('/login.html/verificar/cambiarContra', verificarUsuario);
router.get('/usuario/recuperar.html', verificarToken);
router.post('/usuario/recuperar.html', cambiarContraseña);


module.exports = router;
