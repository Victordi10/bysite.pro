const { executeQuery } = require('../db');

// obtener datos del negocio
const enviarDatosNegocio = (negocioID) => {
    const sql = 'SELECT nombre, logo, descripcion, color_uno, color_dos, id_unico_dueno, instagram, telefono_whatsapp, correo FROM negocios WHERE nombre = ?';
    return executeQuery(sql, [negocioID]);
};

// función para obtener las categorías únicas
const categoriasUnicas = (negocioID) => {
    const sql = 'SELECT DISTINCT categoria FROM productos WHERE negocio_id = ?';
    return executeQuery(sql, [negocioID]);
};

// función para obtener los productos
const enviarProductos = (negocioID) => {
    const sql = 'SELECT * FROM productos WHERE negocio_id = ?';
    return executeQuery(sql, [negocioID]);
};

module.exports = {
    enviarDatosNegocio,
    categoriasUnicas,
    enviarProductos
};