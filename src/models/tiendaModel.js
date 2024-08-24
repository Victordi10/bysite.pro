const {executeQuery } = require('../db');
const fs = require('node:fs');
const path = require('path')




const obtenerNombre_idUnico = (subDominio) => {
    const sql = 'SELECT id_unico_dueno, nombre, id FROM negocios WHERE subDominio = ?';  
    return executeQuery(sql, [subDominio])
        .then(result => {
            if (result.length > 0) {
                return result[0];
            } else {
                console.error("No se encontró el id_unico_dueno ni nombre del negocio para el id del negocio proporcionado");
                return null
            }
        })
        .catch(err => {
            console.error("Error al consultar el id_unico_dueno y nombre del negocio", err);
            throw err;
        });
};

//funcion para obtener las categorias y enviarlas
const categoriasPortadas =(negocio_id )=>{
    const sql = 'SELECT MIN(producto_logo) AS producto_logo, categoria FROM productos WHERE negocio_id  = ? GROUP BY categoria LIMIT 5';
    return executeQuery(sql, [negocio_id ])
        .then(categorias => {
            return categorias
        })
        .catch(err =>{
            console.error("error en enviar las categorias unicas",err)
           throw err;
        })
}

// función para obtener las categorías únicas
const categoriasUnicas = (negocio_id ) => {
    const sql = 'SELECT DISTINCT categoria FROM productos WHERE negocio_id  = ? LIMIT 5';
    return executeQuery(sql, [negocio_id ])
};


//funcion para obtener los datos del negocio
const enviarDatosNegocio =  (subDominio)=>{
    try {
        const sql = 'SELECT nombre,logo,descripcion,fondo_cover,titulo_cover,color_uno,color_dos,color_fondo,instagram,whatsapp,facebook,tiktok,youtube,correo FROM negocios WHERE subDominio = ?'
        return executeQuery(sql,[subDominio])
    } catch (error) {
        console.error("error al consultar los datos del negocio",err)
        throw err;
    }
}
const obtenerTipografiaNegocio = (subDominio)=>{
    const sql = 'SELECT tipografia FROM negocios WHERE subDominio = ?'
    return executeQuery(sql,[subDominio])
}
const obtenerFontFamily = (idTipografia)=>{
    const sql = 'SELECT font_family FROM tipografias WHERE id = ?'
    return executeQuery(sql,[idTipografia])
}

    // función para obtener los productos
const enviarProductos = (negocioID) => {
    const sql = 'SELECT * FROM productos WHERE negocio_id  = ?';
    return executeQuery(sql, [negocioID]);
};

// Función para buscar el subdominio en la base de datos
const buscarSubdominio = async (negocioID) => {
    const sql = 'SELECT subDominio FROM negocios WHERE id = ?';
    const result = await executeQuery(sql, [negocioID]);
    if (result.length > 0) {
        return result[0].subDominio;
    } else {
        return null;
    }
};

const negociosAll = async () => {
    const sql = "SELECT id, nombre, logo, id_unico_dueno FROM negocios";
    try {
        return await executeQuery(sql);
    } catch (error) {
        console.error("Error al ejecutar la consulta", error);
        throw error;
    }
};

module.exports = {
    enviarDatosNegocio,
    categoriasUnicas,
    obtenerNombre_idUnico,
    enviarProductos,
    categoriasPortadas,
    obtenerTipografiaNegocio,
    obtenerFontFamily,
    negociosAll,
    buscarSubdominio

}