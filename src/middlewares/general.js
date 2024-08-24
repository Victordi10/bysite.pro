const obtenerFechaActual = () => {
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();

    // Asegurarse de que el mes y el día tengan dos dígitos
    if (month < 10) {
        month = `0${month}`;
    }
    if (day < 10) {
        day = `0${day}`;
    }

    // Formato ISO (YYYY-MM-DD)
    const fechaActual = `${year}-${month}-${day}`;
    return fechaActual;
};

const detectarSubdominio =(req, res, next) => {
    console.log("Host completo:", req.headers.host);
    const hostParts = req.headers.host.split('.');
    console.log("Partes del host:", hostParts);
    
    const subdomain = hostParts.length > 1 ? hostParts[0] : null;
    console.log("Subdominio detectado:", subdomain);
    
    req.subdomain = subdomain;
    next();
}

module.exports = {
    obtenerFechaActual,
    detectarSubdominio
};