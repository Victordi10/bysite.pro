const path = require('path');
const fs = require('fs');
const  {obtenerNegocioPerfil} = require('../models/negocioModel')
const {removeEmojis} = require("../models/uploadProductos.js")
const { 
    categoriasUnicas, 
    obtenerProductos, 
    verificoCantidadProductos, 
    almacenarFotoProducto,
    actualizarDetalles, 
    eliminarFotoProducto, 
    eliminarProducto,
    obtenerNegocioNombre 
} = require('../models/productosModel.js'); // Asegúrate de que este archivo exporte las funciones mencionadas

const {obtenerSuscribcion,obtenerProductoscanPlan} = require('../middlewares/verificarPlan.js')


const data = {}

const getHtmlNegocio = async (req, res) => {
    try {
        const { id_unico_dueno } = req.params;
        const negocio_id = req.query.id;
        fs.readFile(path.join(__dirname, '../../public', 'negocio.html'), 'utf8',async (err, html) => {
            if (err) {
                console.error("Error al leer el archivo HTML: ", err);
                res.status(500).send("Error en el servidor");
            } else {
                //obtengo la suscripcion
                const suscripcion = await obtenerSuscribcion(id_unico_dueno)
                const negocioNombre = await obtenerNegocioNombre(negocio_id)

                const htmlConCampos = html
                    .replace('%=id_unico_dueno%>', id_unico_dueno)
                    .replace('%=negocio_id%>', negocio_id)
                    .replace('%=suscripcion%>', suscripcion)
                    .replace('%=negocioNombre%>', negocioNombre);
                res.send(htmlConCampos);
            }
        });
    } catch (error) {
        console.error("error al enviar la pagina de negocio",error)
    }
}

const getDatosPerfilNegocio = async(req, res) => {
    
  try {
    const negocio_id = req.query.id;
            const negocio = await obtenerNegocioPerfil(negocio_id)
            if(negocio){
                res.status(200).json(negocio);
            }
    }
   catch (error) {
        console.error("Error al consultar los datos del perfil de negocio: ", error);
        res.status(500).send("Error al consultar los datos del perfil");
  }
};

const getProductosNegocio = async (req, res) => {
    const { negocio_id, negocioNombre } = req.params;
    
    try {
        const categorias = await categoriasUnicas(negocio_id);
        const productos = await obtenerProductos(negocio_id);

        res.status(200).json({
            categorias,
            productos
        });
    } catch (error) {
        console.error("Error en el servidor, al cargar los productos y categorías:", error);
        res.status(500).send("Error en el servidor");
    }
};

const agregarProducto = async (req, res) => {
    const { id_unico_dueno, negocioNombre, negocio_id } = req.params;
    const {productoDesc} = req.body;
    let  productoPrecio = req.body.productoPrecio 
    const productoNombre = removeEmojis(req.body.productoNombre).trim()

     // Validar y limpiar el precio
     if (productoPrecio == "") {
        productoPrecio = 0;
    } else {
        // Eliminar puntos y comas del precio
        productoPrecio = productoPrecio.replace(/[.,]/g, '');
    }
    try {
        const rutaRelativaFoto = req.file ? `negocio_${negocio_id}/productos/producto_${req.productoId}.jpg` : null;
        res.status(201).json({
            mensaje: "El producto se creó correctamente",
            nombre: productoNombre,
            logo: rutaRelativaFoto,
            descripcion: productoDesc,
            precio: productoPrecio,
            negocio_id
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).send("Error en el servidor");
    }
};

const verificarCanProductos = async (req,res)=>{
    try {
        const { id_unico_dueno, negocioNombre, negocio_id } = req.params;
        
        //verificar suscripcion
        const suscripcion = await obtenerSuscribcion(id_unico_dueno);
        const productoscanPlan = await obtenerProductoscanPlan(suscripcion)

        const cantidadProductos = await verificoCantidadProductos(negocio_id);

        if (cantidadProductos >= productoscanPlan) {
            data.mensaje = "Ha alcanzado el máximo de productos permitidos"
            return res.status(403).json(data);
        }else{
            console.log("se pueden crear mas productos")
            res.status(200).send("se pueden crear mas productos")
        }
    } catch (error) {
        res.status(500).send("error al intentar verificar la cantidad de productos",error)
    }
}

const actualizarFotoProducto = async (req, res) => {
    const { negocio_id,id_unico_dueno, negocioNombre, productoNombre } = req.params;
    const { productoID } = req.query;
    const rutaRelativaFoto = req.file ? `negocio_${negocio_id}/productos/producto_${productoID}.jpg` : null;

    try {
        almacenarFotoProducto(negocio_id,productoID)
        if(rutaRelativaFoto){
            data.mensaje = "Se actualizó correctamente la foto"
            const timestamp = new Date().getTime()
            data.src = `${rutaRelativaFoto}?timestamp=${timestamp}`
            res.status(200).json(data);
        }else{
            data.mensaje = "no se encontro ningun archivo"
            console.error("no se encontro ningun archivo:");
            res.status(400).json(data);
        }
    } catch (error) {
        console.error("Error al actualizar la foto del producto:", error);
        res.status(500).send("Error al actualizar la foto");
    }
};
const actualizarDetallesProducto = async (req, res) => {
    const { negocio_id, negocioNombre, id_unico_dueno, productoNombre } = req.params;
    const { productoNombre: nuevoProductoNombreOriginal, productoDesc, productoPrecio: precioOriginal, productoId } = req.body;

    // Eliminar emojis del nuevo nombre del producto
    const nuevoProductoNombre = removeEmojis(nuevoProductoNombreOriginal).trim();

    // Validar y limpiar el precio
    let productoPrecio = precioOriginal;
    if (productoPrecio === "") {
        productoPrecio = 0;
    } else {
        // Eliminar puntos y comas del precio
        productoPrecio = productoPrecio.replace(/[.,]/g, '');
    }

    try {
        await actualizarDetalles( nuevoProductoNombre, productoDesc, productoPrecio, productoId);
        data.detalles = {
            nom: nuevoProductoNombre,
            des: productoDesc,
            precio: productoPrecio
        };
        data.mensaje = "Se actualizó el producto";
        res.status(200).json(data);
    } catch (error) {
        console.error("Error al intentar actualizar los detalles del producto:", error);
        res.status(500).send("Error al intentar actualizar los detalles del producto");
    }
};


const eliminarProductos = async (req, res) => {
    const { negocio_id, id_unico_dueno, negocioNombre, productoNombre, producto_id } = req.params;
    try {
        await eliminarFotoProducto(id_unico_dueno,negocio_id, producto_id);
        await eliminarProducto(negocio_id, producto_id);
        res.status(200).send("El producto fue eliminado con éxito");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al intentar eliminar el producto");
    }
};

module.exports = {
    getHtmlNegocio,
    getDatosPerfilNegocio,
    getProductosNegocio,
    agregarProducto,
    verificarCanProductos,
    actualizarFotoProducto,
    actualizarDetallesProducto,
    eliminarProductos
};
