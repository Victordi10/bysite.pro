// Middleware para redirigir HTTP a HTTPS
const verificarProto = (req, res, next) => {
    if (req.protocol === 'http') {
        // Redirigir a HTTPS
        res.redirect(301, `https://${req.get('host')}${req.originalUrl}`);
    } else {
        // Continuar con la siguiente middleware o ruta
        next();
    }
};

