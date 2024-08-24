//const host = process.env.HOST
const host = process.env.HOSTDB
// Middleware para verificar si el usuario ha iniciado sesión
function verificarSesion(req, res, next) {
    // Verifica si existe un usuario en la sesión
    if (req.session && req.session.userId) {
        // Si el usuario ha iniciado sesión, continúa con la siguiente ruta
        next();
    } else {
        // Si el usuario no ha iniciado sesión, redirige a la página de inicio de sesión
        //res.redirect(`https://${host}/login.html`);
        res.redirect(`http://${host}:8020/login.html`);
    }
}

module.exports = {
    verificarSesion
}
