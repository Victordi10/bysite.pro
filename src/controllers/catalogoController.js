const fs = require('fs');
const path = require('path');
const { enviarDatosNegocio, categoriasUnicas, enviarProductos } = require('../models/catalogoModel.js');

// Controlador para la página de venta del catálogo
const mostrarPaginaCatalogo = (req, res) => {
    const negocioNombre = req.params.negocioNombre;
    const idNegocio = req.params.idNegocio
    console.log("Página de venta negocio: ", negocioNombre);
    fs.readFile(path.join(__dirname, '../../public/venta/catalogo', 'catalogo.html'), 'utf8', (err, html) => {
        if (err) {
            console.error("Error al leer el archivo HTML: ", err);
            res.status(500).send("Error en el servidor");
        } else {
            const negocioNombreConEspacios = negocioNombre.replace(/_/g, ' ');
            const htmlConCampos = html
                .replace('%=negocioNombre%>', negocioNombreConEspacios)
                .replace('%=idNegocio%>', idNegocio)
                .replace('%=negocioNombre2%>', negocioNombreConEspacios);
            res.send(htmlConCampos);
        }
    });
};

// Controlador para obtener los datos del catálogo
const obtenerDatosCatalogo = async (req, res) => {
    const nombreNegocio = req.params.negocioNombre.replace(/\s+/g, '_');
    const idNegocio = req.params.idNegocio
    const nombreTabla = `${nombreNegocio}_${idNegocio}`
    console.log("Cargando los datos para el catálogo...", nombreNegocio);

    try {
        const negocioDatos = await enviarDatosNegocio(nombreNegocio);
        const categorias = await categoriasUnicas(nombreTabla);
        const productos = await enviarProductos(nombreTabla);

        const json = {
            negocio: negocioDatos,
            categorias: categorias,
            productos: productos
        };
        res.status(200).json(json);
    } catch (error) {
        console.error("Error al cargar los datos del catálogo:", error);
        res.status(500).send("Error al cargar los datos del catálogo");
    }
};

module.exports = {
    mostrarPaginaCatalogo,
    obtenerDatosCatalogo
};


