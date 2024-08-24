const {executeQuery } = require('../db');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const {enviarCorreo} = require('../middlewares/enviarCorreos.js')

const verificarUser = (userEmail) => {
    const sql = 'SELECT COUNT(*) AS count FROM usuarios WHERE correo = ?';
    return executeQuery(sql, [userEmail]);
};

const insertarUsuario = (correoUser, contraseña, aceptarTerminos, idUnico) => {
    const sql = "INSERT INTO usuarios(correo,contraseña,terminos_condiciones,id_unico) VALUES(?,?,?,?)";
    return executeQuery(sql, [correoUser, contraseña, aceptarTerminos, idUnico]);
};

async function generadorIdsUnicos(correo) {
    return crypto.createHash('md5').update(correo).digest('hex');
}

async function generarTokenConfirmacion(idUnico) {
    const expiracion = Date.now() + 24 * 60 * 60 * 1000; // 24 horas en milisegundos
    return `${idUnico}.${expiracion}`;
}

const generarCodigoVerificacion = () => {
    const longitudCodigo = 6;
    const caracteres = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let codigo = '';
    for (let i = 0; i < longitudCodigo; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres[indice];
    }
    return codigo;
};

async function hashearContraseñas(contraseña) {
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(contraseña, salt);
    } catch (error) {
        console.error("Error al hashear la contraseña:", error);
        throw error;
    }
}

const enviarCorreoConfirmacion = (correoUser, codigoVerificacion, PlantillaCorreo) => {
    const placeholders = {
        codigoVerificacion
    }
    return enviarCorreo({
        correoUser,
        subject:'Código de Verificación',
        template: PlantillaCorreo,
        placeholders
    })
};

const enviarCorreoBienvenidad = (correoUser, PlantillaCorreo) => {
    return enviarCorreo({
        correoUser,
        subject:'Bienvenid@ a Bysite pro',
        template: PlantillaCorreo,
    })
};



const verificarTokenConfirmacion = async (token) => {
    const [idUnico, expiracion] = token.split('.');
    return {
        idUnico: idUnico,
        expiracion: parseInt(expiracion)
    };
};




module.exports = {
    verificarUser,
    insertarUsuario,
    generadorIdsUnicos,
    generarTokenConfirmacion,
    hashearContraseñas,
    enviarCorreoConfirmacion,
    verificarTokenConfirmacion,
    generarCodigoVerificacion,
    enviarCorreoBienvenidad
};
