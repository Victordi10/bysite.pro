
const fs = require('fs'); // Importa el módulo fs tradicional
const fsPromises = fs.promises; // Importa el módulo de promesas de fs
const path = require('path');

const {enviarCorreoAdmin} = require('../middlewares/enviarCorreos.js')
const {obtenerFechaActual} = require('../middlewares/general.js')

const {
    verificarUser,
    insertarUsuario,
    generadorIdsUnicos,
    generarTokenConfirmacion,
    hashearContraseñas,
    enviarCorreoConfirmacion,
    enviarCorreoBienvenidad,
    generarCodigoVerificacion
 } = require('../models/registroUserModel.js');


 const urlConfirmacion = `${process.env.URL}/confirmacion`;
 
const datosUsuariosTemporales = {};




// Leer el template del correo electrónico
const emailCodigo = path.join(__dirname, '../../public/correos', 'emailConfirm.html');
const emailBienvenidad = path.join(__dirname, '../../public/correos', 'emailBienvenidad.html');


const data = {}

const registrarUsuario = async (req, res) => {
    const { userEmail, userContraseña, aceptarTerminos } = req.body;
    const emailTemplate = fs.readFileSync(emailCodigo, 'utf8'); // Usa fs tradicional para leer archivos sincrónicamente

    try {
        const result = await verificarUser(userEmail);
        const filasCount = result[0].count;

        if (filasCount < 1) {
            const idUnico = await generadorIdsUnicos(userEmail);
            const contraseña = await hashearContraseñas(userContraseña);
            const codigoVerificacion = generarCodigoVerificacion();
            
            await enviarCorreoConfirmacion(userEmail, codigoVerificacion, emailTemplate)
            .then((mensaje) => {
                console.log(mensaje);
                datosUsuariosTemporales[userEmail] = { contraseña, aceptarTerminos, codigoVerificacion, idUnico };
                console.log('Datos temporales almacenados:', datosUsuariosTemporales);
                data.mensaje = "Te enviamos un código de verificación por correo. Por favor, introdúcelo para continuar.";
                res.status(200).json(data);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send("Hubo un problema al enviar el correo de confirmación. Por favor, inténtalo de nuevo más tarde.");
            });
        } else {
            res.status(409).json({ mensaje: "El usuario se encuentra registrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al registrar el usuario, inténtelo de nuevo" });
    }
};


const confirmarCodigo = async (req, res) => {
    const { userEmail, codigo } = req.body;
    const datosUsuario = datosUsuariosTemporales[userEmail];
    const emailTemplate = fs.readFileSync(emailBienvenidad, 'utf8'); // Usa fs tradicional para leer archivos sincrónicamente



    if (datosUsuario && datosUsuario.codigoVerificacion === codigo) {
        const { contraseña, aceptarTerminos, idUnico } = datosUsuario;

        try {
            await insertarUsuario(userEmail, contraseña, aceptarTerminos, idUnico);
            const rutaCarpeta = path.join(__dirname, '../../public/usuarios', idUnico);
            req.session.userId = idUnico;

            try {
                await fsPromises.mkdir(rutaCarpeta, { recursive: true });
                console.log(`La carpeta para el ${userEmail} se ha creado correctamente como ${idUnico}`);
            } catch (err) {
                console.error(`Error al crear la carpeta para el usuario ${userEmail}:`, err);
                res.status(500).send("Error al crear la carpeta del usuario. Por favor, intenta nuevamente.");
                return;
            }

            delete datosUsuariosTemporales[userEmail];
            data.mensaje = "¡Tu correo electrónico ha sido confirmado con éxito!"
            data.data = idUnico
            //envio correo de bienvenido
            
            const fecha = obtenerFechaActual()
            await enviarCorreoAdmin("Nuevo usuario",userEmail,fecha,null,null)

            setTimeout(async()=>{await enviarCorreoBienvenidad(userEmail,emailTemplate)},1000)
            res.status(200).json(data);
            
            
            
        } catch (error) {
            console.error("Error al confirmar el correo electrónico:", error);
            res.status(500).send("Error al confirmar el correo electrónico. Por favor, intenta nuevamente.");
        }
    } else {
        data.mensaje = "Código de verificación incorrecto o expirado."
        res.status(400).json(data);
    }
};




module.exports = {
    registrarUsuario,
    confirmarCodigo
    
};
