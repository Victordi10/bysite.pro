const {executeQuery } = require('../db');


// Función para buscar registros
// Función para buscar registros
const buscarAdmin = (parametro, idNegocio) => {
  // NOTA: No se puede usar ? para el nombre de la tabla en SQL
  const sql = `
    SELECT * FROM productos
    WHERE producto_nombre LIKE ?
    OR producto_precio LIKE ?
    OR producto_descripcion LIKE ?
    OR categoria LIKE ? 
    AND negocio_id = ?
  `;
  const params = [
    `%${parametro}%`,
    `%${parametro}%`,
    `%${parametro}%`,
    `%${parametro}%`,
    `%${idNegocio}%`
  ];

  return executeQuery(sql, params);
};

module.exports = {
    buscarAdmin
};
