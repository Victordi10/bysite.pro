const fs = require('fs');
const path = require('path');
const {executeQuery } = require('../db');



// Obtener correo 
function obtenerCorreo(idUnico) {
    const sql = 'SELECT correo FROM usuarios WHERE id_unico = ?';
    return executeQuery(sql, [idUnico])
        .then(result => result[0]?.correo)
        .catch(err => {
            console.error("Error al intentar obtener el correo del usuario", err);
            throw err;
        });
}
// Verificar cantidad de negocios
function obtenerCantidadNegocios(idUnico) {
    const sql = 'SELECT * FROM negocios WHERE id_unico_dueno = ?';
    return executeQuery(sql, [idUnico])
        .then(filas => filas.length)
        .catch(err => {
            console.error("Error al consultar la cantidad de negocios", err);
            throw err;
        });
}

//obtengo los negocios
function obtnerNegocios(id_unico){
    const sql = 'SELECT * FROM negocios WHERE id_unico_dueno = ?'
    return executeQuery(sql,[id_unico])
    .then(negocios => {return negocios})
    .catch(err =>{
        console.error("error al obtener los negocios",err)
        throw err;
    })
}
//obtengo negocio
function obtenerNegocioPerfil(idNegocio){
    const sql = "SELECT * FROM negocios WHERE id = ?";
    return executeQuery(sql,[idNegocio])
    .catch(err =>{
        console.error("error al obtener el negocio",err)
        throw err;
    })
}

// Verificar si existe un negocio con el mismo nombre
function verificarNegocioMismoNombre(idUnico, negocioNombre) {
    const sql = 'SELECT nombre FROM negocios WHERE id_unico_dueno = ? AND nombre = ?';
    return executeQuery(sql, [idUnico, negocioNombre])
        .then(negocios => negocios.length >= 1)
        .catch(err => {
            console.error("Error al verificar el nombre del negocio", err);
            throw err;
        });
}

//Validoel numero de whatsapp
function ajustarNumeroWhatsApp(numero) {
    // Remover espacios, guiones y paréntesis
    numero = numero.replace(/[\s()-]/g, '');
    // Si el número no empieza con '+', asume que es un número local y agrega '+57' (puedes ajustar esto según sea necesario)
    if (!numero.startsWith('+')) {
        return '+57' + numero;
    }
    return numero;
}

// Crear un nuevo negocio
const crearNegocio = async (datosNegocio, negocioNombre, rutaLogo, id_unico_dueno) => {
    const sql = 'INSERT INTO negocios(tipo, nombre, logo, descripcion, color_uno, color_dos, color_fondo, id_unico_dueno) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [datosNegocio.tipoNegocio, negocioNombre, rutaLogo, datosNegocio.negocioDesc, datosNegocio.colorUno, datosNegocio.colorDos, datosNegocio.colorFondo, id_unico_dueno];
    try {
        const result = await executeQuery(sql, values);
        return result.insertId; // Devolver el ID del negocio creado
    } catch (err) {
        console.error("Error al crear el negocio", err);
        throw err;
    }
}

// Actualizar la ruta del logo
const actualizarRutaLogo = async (negocioId, rutaLogo) => {
    const sql = 'UPDATE negocios SET logo = ? WHERE id = ?';
    const values = [rutaLogo, negocioId];
    try {
        await executeQuery(sql, values);
    } catch (err) {
        console.error("Error al actualizar la ruta del logo", err);
        throw err;
    }
}
const actualizarCoverFoto = async(negocioId, rutaLogo)=>{
    const sql = 'UPDATE negocios SET fondo_cover = ? WHERE id = ?';
    const values = [rutaLogo, negocioId];
    try {
        await executeQuery(sql, values);
    } catch (err) {
        console.error("Error al actualizar la ruta de la foto de cover", err);
        throw err;
    }
}

// Eliminar archivos del negocio
function eliminarArchivosNegocio(id_unico_dueno,negocioID) {
    const rutaCarpeta = path.join(__dirname, `../../public/usuarios/${id_unico_dueno}/negocio_${negocioID}`);
    return new Promise((resolve, reject) => {
        if (fs.existsSync(rutaCarpeta)) {
            fs.rm(rutaCarpeta, { recursive: true }, err => {
                if (err) {
                    console.error(err);
                    reject(`Error al eliminar los archivos del negocio: ${negocioID}`);
                } else {
                    resolve(`La carpeta del negocio: ${negocioID} se ha eliminado correctamente`);
                }
            });
        } else {
            resolve(`No existen archivos para el negocio: ${negocioID}`);
        }
    });
}

// Elimina el archivo si existe y verifica el resultado
const borrarArchivo = (negocioID, id_unico_dueno) => {
    const rutaArchivo = path.join(__dirname, `../../public/usuarios/${id_unico_dueno}/negocio_${negocioID}/coverfoto.jpg`);
    return new Promise((resolve, reject) => {
        if (fs.existsSync(rutaArchivo)) {
            fs.unlink(rutaArchivo, err => {
                if (err) {
                    console.error(`Error al borrar ${rutaArchivo}:`, err);
                    reject(err);
                } else {
                    console.log(`La imagen ${rutaArchivo} se borró con éxito.`);
                    resolve(true);
                }
            });
        } else {
            console.log(`El archivo ${rutaArchivo} no existe.`);
            resolve(false);
        }
    });
};
//elimino el archivo en la DB
const borrarArchivoDB =(negocioID)=>{
    const sql = 'UPDATE negocios SET fondo_cover = NULL WHERE id = ?'
    return executeQuery(sql, [negocioID])
}


 // Eliminar productos del negocio
function eliminarProductosNegocio(idNegocio) {
    const sql = 'DELETE FROM productos WHERE negocio_id = ?';
    return executeQuery(sql, [idNegocio])
        .then(() => `Los productos del negocio se eliminaron correctamente`)
        .catch(err => {
            console.error("Error al eliminar los productos del negocio", err);
            throw err;
        });
} 

// Eliminar un negocio
function eliminarNegocio(negocio_id) {
    const sql = 'DELETE FROM negocios WHERE id = ?';
    return executeQuery(sql, [negocio_id])
        .then(() => `El negocio fue eliminado con éxito`)
        .catch(err => {
            console.error("Error al eliminar el negocio", err);
            throw err;
        });
}




const almacenarNegocioLogoDB = (rutaRelativaLogo,negocioID)=>{
    // Aquí puedes agregar la lógica para almacenar la foto en la base de datos, si es necesario
    const sql = 'UPDATE negocios SET logo = ? WHERE id = ?';
    return executeQuery(sql,[ rutaRelativaLogo, negocioID])
    .then(console.log("logo guardado correctamente"))
    .catch(err=> console.error("error al guardar el logo en la base de datos"))
}


// Actualizar datos del negocio en la base de datos
function actualizarDatosNegocio(values) {
    const sql = 'UPDATE negocios SET nombre = ?, descripcion = ?, correo = ?, whatsapp = ?, instagram = ?, facebook = ?,tiktok = ?, youtube = ? WHERE id = ?';
    return executeQuery(sql, values)
        .then(result => {
            if (result.affectedRows > 0) {
                return "El negocio se actualizó correctamente";
            } else {
                throw new Error("No se encontró ningún negocio para actualizar");
            }
        })
        .catch(err => {
            console.error("Error al actualizar los datos del negocio", err);
            throw err;
        });
}

// Actualizar datos del negocio en la base de datos
function actualizarDatosCatalogo(values) {
    const sql = 'UPDATE negocios SET titulo_cover = ?, color_uno = ?, color_dos = ?, color_fondo = ?, tipografia  = ? WHERE id = ?';
    return executeQuery(sql, values)
        .then(result => {
            if (result.affectedRows > 0) {
                return "El catalog se actualizó correctamente";
            } else {
                throw new Error("No se encontró ningún negocio para actualizar el catalogo");
            }
        })
        .catch(err => {
            console.error("Error al actualizar los datos del catalogo", err);
            throw err;
        });
}

//logica de subdominio
const verificarSubdominio = (subDominio, id)=>{
    const sql = 'SELECT subDominio FROM negocios WHERE subDominio = ? && id <> ?'
    return executeQuery(sql, [subDominio,id])
    .then(filas => {return filas.length})
    .catch(err => {
        console.error("Error al verifcar si existe el subdominio", err);
        throw err;
    });
}
const validarYNormalizarSubdominio = (subdominio) => {
    // Convertir espacios en guiones
    subdominio = subdominio.replace(/\s+/g, '-');

    // Eliminar guiones al inicio y al final
    subdominio = subdominio.replace(/^-+|-+$/g, '');

    // Verificar si el subdominio cumple con las restricciones
    const regex = /^[a-z0-9-]+$/;
    if (!regex.test(subdominio)) {
        return { esValido: false, subdominio: '', mensaje: "Caracteres inválidos" };
    }

    // Longitud del subdominio
    if (subdominio.length < 1 || subdominio.length > 63) {
        return { esValido: false, subdominio: '', mensaje: "Longitud inválida" };
    }

    // Subdominios reservados
    const reservados = ["www", "ftp", "mail", "smtp", "imap"];
    if (reservados.includes(subdominio)) {
        return { esValido: false, subdominio: '', mensaje: "Subdominio reservado" };
    }

    return { esValido: true, subdominio: subdominio, mensaje: "" };
}

const actualizarSubdominio = (id,subDominio)=>{
    const sql = 'UPDATE negocios SET subDominio = ? WHERE id = ?'
    return executeQuery(sql, [subDominio, id])
        .then(result => {
            if (result.affectedRows > 0) {
                return "El subdominio se actualizó correctamente";
            } else {
                throw new Error("No se actualizo el subdominio");
            }
        })
        .catch(err => {
            console.error("Error al actualizar los datos del negocio", err);
            throw err;
        });
}

const subdominioPorDefecto = (negocioID, negocioNombre)=>{
    const subdominio = `${negocioNombre}${negocioID}`
    const sql = 'UPDATE negocios SET subDominio = ? WHERE id = ?'
    return executeQuery(sql, [subdominio, negocioID])
    .then(result => {
        if (result.affectedRows > 0) {
            console.log("subdominio por defecto guardado")
        } else {
            throw new Error("No se actualizo el subdominio por defecto");
        }
    })
    .catch(err => {
        console.error("Error al actualizar los datos del negocio", err);
        throw err;
    });
}

const obtenerTipografias = async()=>{
    const sql = 'SELECT * FROM tipografias'
    return executeQuery(sql)   
}

const obtenerTiposNegocios = () => {
    const sql = 'SELECT * FROM tiposNegocios';
    return executeQuery(sql)
    .then(result => {
        return result; 
    })
    .catch(err => {
        console.error("Error al obtener los tipos de negocios", err);
        throw err;
    });
};

module.exports = {
    obtenerCorreo,
    obtenerCantidadNegocios,
    obtnerNegocios,
    obtenerNegocioPerfil,
    verificarNegocioMismoNombre,
    crearNegocio,
    actualizarRutaLogo,
    eliminarArchivosNegocio,
    eliminarProductosNegocio,
    eliminarNegocio,
    almacenarNegocioLogoDB,
    actualizarDatosNegocio,
    ajustarNumeroWhatsApp,
    obtenerTipografias,
    actualizarSubdominio,
    verificarSubdominio,
    subdominioPorDefecto,
    validarYNormalizarSubdominio,
    obtenerTiposNegocios,
    actualizarDatosCatalogo,
    actualizarCoverFoto,
    borrarArchivo,
    borrarArchivoDB
};