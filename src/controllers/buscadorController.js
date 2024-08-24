const {buscarAdmin} = require('../models/buscadorModel.js');
const data = {}
// Controlador para manejar la búsqueda
const buscadorAdmin = async (req, res) => {
  const parametro = req.query.parametro;
  const idNegocio = req.params.idNegocio;

  try {
      const result = await buscarAdmin(parametro, idNegocio);
      console.log(result);

      if (result.length === 0) {
          res.status(404).json({ mensaje: 'No se encontraron artículos' });
      } else {
          res.status(200).json(result);
      }
  } catch (err) {
      data.mensaje = "Error en el buscador";
      console.error("Error en el buscador admin:", err.message);
      res.status(500).json(data);
  }
};

module.exports = {
    buscadorAdmin
}