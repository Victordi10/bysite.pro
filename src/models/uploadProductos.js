const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const {executeQuery } = require('../db');

const {crearProducto,actualizarRutaFoto,verificoCantidadProductos} = require('../models/productosModel.js')
const {obtenerSuscribcion,obtenerProductoscanPlan} = require('../middlewares/verificarPlan.js')


// Configurar almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Función para eliminar emojis
function removeEmojis(str) {
    if (typeof str !== 'string') {
        throw new TypeError('El argumento debe ser un string');
    }
    return str.replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
              .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Symbols & Pictographs
              .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport & Map
              .replace(/[\u{1F700}-\u{1F77F}]/gu, '') // Alchemical Symbols
              .replace(/[\u{1F780}-\u{1F7FF}]/gu, '') // Geometric Shapes Extended
              .replace(/[\u{1F800}-\u{1F8FF}]/gu, '') // Supplemental Arrows-C
              .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols & Pictographs
              .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Chess Symbols
              .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Symbols and Pictographs Extended-A
              .replace(/[\u{2600}-\u{26FF}]/gu, '') // Miscellaneous Symbols
              .replace(/[\u{2700}-\u{27BF}]/gu, '') // Dingbats
              .replace(/[\u{1F900}-\u{1F9FF}]/gu, ''); // Supplemental Symbols & Pictographs
}

// Middleware para optimizar y guardar la imagen del producto
// Middleware para optimizar y guardar la imagen del producto
const optimizeAndSaveImage = async (req, res, next) => {
    try {
        const { id_unico_dueno, negocio_id } = req.params;
        const { productoDesc, productoPrecio } = req.body;
        let idProducto = req.query.productoID
        if(req.method === 'POST'){
            // Validar y limpiar el precio
            let precio = productoPrecio.replace(/[.,]/g, '');
            if (precio === "") {
                precio = 0;
            } else {
                precio = parseInt(precio);
            }
    
            // Verificar suscripción del usuario
            const suscripcion = await obtenerSuscribcion(id_unico_dueno);
            const productoscanPlan = await obtenerProductoscanPlan(suscripcion);
    
            // Verificar cantidad de productos del negocio
            const cantidadProductos = await verificoCantidadProductos(negocio_id);
            if (cantidadProductos >= productoscanPlan) {
                return res.status(403).json({ mensaje: "Ha alcanzado el máximo de productos permitidos" });
            }
    
            // Crear el producto en la base de datos
            const productoNombre = removeEmojis(req.params.productoNombre.replace(/\s+/g, '_').toLowerCase()).trim();
            const value = [productoNombre, productoDesc, precio, null, negocio_id];
            idProducto = await crearProducto(value);
        }

        if (req.file) {
            // Ruta para almacenar la imagen optimizada del producto
            const uploadPath = path.join(__dirname, `../../public/usuarios/${id_unico_dueno}/negocio_${negocio_id}/productos`);

            // Verificar si el directorio existe, si no, crearlo
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            // Ruta y nombre de archivo optimizado
            const optimizedPath = path.join(uploadPath, `producto_${idProducto}.jpg`);

            // Optimizar y guardar la imagen del producto
            sharp(req.file.buffer)
                .resize(500) // Redimensionar la imagen
                .jpeg({ quality: 80 }) // Comprimir la imagen
                .toFile(optimizedPath, async (err, info) => {
                    if (err) {
                        console.error('Error al optimizar la imagen:', err);
                        return next(err);
                    }
                    // Actualizar la ruta de la foto en la base de datos
                    await actualizarRutaFoto(idProducto, `negocio_${negocio_id}/productos/producto_${idProducto}.jpg`);
                    console.log('Imagen optimizada guardada en:', optimizedPath);
                    req.productoId = idProducto;
                    next();
                });
        } else {
            next();
        }
    } catch (error) {
        console.error("Error en optimizeAndSaveImage:", error);
        next(error);
    }
};

module.exports = {
    upload,
    optimizeAndSaveImage,
    removeEmojis
};
