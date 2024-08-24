const bcrypt = require('bcryptjs')
const crypto = require('crypto');
const {executeQuery } = require('../db');
const jwt = require('jsonwebtoken');
const {enviarCorreo} = require('../middlewares/enviarCorreos.js')



// Clave secreta para firmar el token (debe estar en una variable de entorno en producción)
const secretKey = process.env.SECRET_KEY;


// Función para generar el token
const generarToken = (correo) => {
    const payload = { correo };
    const opciones = { expiresIn: '30m' }; // El token expira en 30 minutos
    return jwt.sign(payload, secretKey, opciones);
};


async function compararContraseñas(contraEntrante, contraGuardada) {
    try {
        // Compara la contraseña entrante con la contraseña guardada utilizando bcrypt
        const contras = await bcrypt.compare(contraEntrante, contraGuardada);
        return contras; // Devuelve el resultado de la comparación (true o false)
    } catch (error) {
        console.error("Error al comparar las contraseñas:", error);
        throw error; // Lanza el error para que se maneje en el código que llama a esta función
    }
}

const getUserByEmail = (userEmail) => {
    const sql = 'SELECT correo, contraseña, id_unico FROM usuarios WHERE correo = ?';
    return executeQuery(sql, [userEmail]);
};

const verificarEmail = async (correo) => {
    const sql = 'SELECT correo FROM usuarios WHERE correo = ?';
    try {
        const resultados = await executeQuery(sql, [correo]);
        return resultados.length > 0;
    } catch (err) {
        console.error("Error al intentar verificar si el correo existe", err);
        throw err; // Lanza el error para que sea capturado en `verificarUsuario`
    }
};

const enviarCorreoCambiarContra = (correoUser, confirmationUrl, PlantillaCorreo) => {
    const placeholders = {
        confirmationUrl
    }
        return enviarCorreo({
            correoUser,
            subject:'Cambiar contraseña',
            template: PlantillaCorreo,
            placeholders
        })
};

const cambiarContraseñaEnDB = (contraseña,correo)=>{
    const sql = "UPDATE usuarios SET contraseña = ? WHERE correo = ?"
    return executeQuery(sql,[contraseña,correo])
    .then(result => {
        if (result.affectedRows === 1) {
            return { success: true, message: 'Contraseña actualizada con éxito' };
        } else {
            return { success: false, message: 'No se pudo actualizar la contraseña' };
        }
    })
    .catch(err => {
        console.error('Error al intentar actualizar la contraseña', err);
        return { success: false, message: 'Ocurrió un error al actualizar la contraseña' };
    });
} 


module.exports = {
    getUserByEmail,
    compararContraseñas,
    verificarEmail,
    enviarCorreoCambiarContra,
    generarToken,
    cambiarContraseñaEnDB
};