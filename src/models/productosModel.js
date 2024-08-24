const {executeQuery } = require('../db');
const path = require('path')
const fs = require('node:fs');


//funcion para obtener las categorias y enviarlas
const categoriasUnicas = (negocio_id) => {
    console.log("buscando categorias...");
    const sql = 'SELECT DISTINCT categoria FROM productos WHERE negocio_id = ?';
    return executeQuery(sql, [negocio_id]);
};

//funcion para obtener los productos
const obtenerProductos = (negocio_id) => {
    console.log("Obteniendo productos...");
    const sql = 'SELECT * FROM productos WHERE negocio_id = ?';
    return executeQuery(sql, [negocio_id]);
};

const obtenerNegocioNombre  = (negocioId) =>{
    const sql = 'SELECT nombre FROM negocios WHERE id = ?'
    console.log("obteniendo nombre de negocio")
    return executeQuery(sql,[negocioId]).then(result => result[0].nombre).catch(err => console.error("error al obtener el nombre del negocio",err))
}

//verifico cantidad de productos
const verificoCantidadProductos = (negocio_id) => {
    console.log("verificando cantidad de productos...");
    const sql = 'SELECT * FROM productos WHERE negocio_id = ?';
    return executeQuery(sql, [negocio_id]).then(filas => filas.length);
};



const crearProducto = async(value) => {
    console.log("Datos a ingresar: ", value);
    const sql = 'INSERT INTO productos (producto_nombre, producto_descripcion, producto_precio, producto_logo, negocio_id) VALUES (?, ?, ?, ?, ?)';
    try {
        const result = await executeQuery(sql, value);
        return result.insertId; // Devolver el ID del negocio creado
    } catch (error) {
        console.error("Error al crear el producto",error)
    }
};

// Actualizar la ruta de la foto
const actualizarRutaFoto = async (productoID, rutaLogo) => {
    const sql = 'UPDATE productos SET producto_logo = ? WHERE id = ?';
    const values = [rutaLogo, productoID];
    try {
        await executeQuery(sql, values);
    } catch (err) {
        console.error("Error al actualizar la ruta del logo", err);
        throw err;
    }
}


const almacenarFotoProducto = (negocio_id,productoID)=>{
    const rutaRelativa = `negocio_${negocio_id}/productos/producto_${productoID}.jpg`;
    const sql = 'UPDATE productos SET producto_logo = ? WHERE id = ?';
    executeQuery(sql, [ rutaRelativa, productoID])
        .then(() => console.log("El nombre del archivo y de la imagen en la base de datos se actualizaron correctamente"))
        .catch(err => {
            console.error("Error al actualizar el nombre de la imagen en la base de datos:", err);
        });
}
//funcion para cambiar en la base de datos
const actualizarDetalles = ( nuevoProductoNombre, nuevoProductoDesc, nuevoProductoPrecio, productoId) => {
    console.log("Actualizando detalles del producto...");
    const sql = 'UPDATE productos SET producto_nombre = ?, producto_descripcion = ?, producto_precio = ?  WHERE id = ?';
    return executeQuery(sql, [ nuevoProductoNombre, nuevoProductoDesc, nuevoProductoPrecio, productoId])
        .then(result => {
            if (result.affectedRows > 0) {
                return "El producto se actualizó correctamente";
            } else {
                throw new Error("No se encontró ningún producto para actualizar");
            }
        });
};



//funcion para eliminar foto del producto
const eliminarFotoProducto = (id_unico_dueno, negocioID, productoID) => {
    console.log("Eliminando foto del producto...");
    return new Promise((resolve, reject) => {
        const rutaFoto = path.join(__dirname, `../../public/usuarios/${id_unico_dueno}/negocio_${negocioID}/productos/producto_${productoID}.jpg`);
        console.log("ruta de archivo a elimir",rutaFoto)
        if (fs.existsSync(rutaFoto)) {
            fs.unlink(rutaFoto, (err) => {
                if (err) {
                    console.error("Error al eliminar la foto del producto:", err);
                    reject("Error al eliminar la foto del producto");
                } else {
                    console.log("Foto del producto eliminada correctamente");
                    resolve("Foto del producto eliminada correctamente");
                }
            });
        } else {
            console.log("La foto del producto no existe, no se puede eliminar");
            resolve("La foto del producto no existe, no se puede eliminar");
        }
    });
};

const eliminarProducto = (negocioID, producto_id) => {
    console.log("Eliminando el producto...");
    const sql = 'DELETE FROM productos WHERE id = ? AND negocio_id = ?';
    return executeQuery(sql, [producto_id, negocioID]).then(() => "El producto fue eliminado con éxito");
};


// Exportar las funciones
module.exports = {
    categoriasUnicas,
    obtenerProductos,
    verificoCantidadProductos,
    crearProducto,
    actualizarRutaFoto,
    almacenarFotoProducto,
    actualizarDetalles,
    eliminarFotoProducto,
    eliminarProducto,
    obtenerNegocioNombre
};



