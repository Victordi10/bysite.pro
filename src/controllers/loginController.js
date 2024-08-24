const { getUserByEmail,compararContraseñas,verificarEmail,enviarCorreoCambiarContra,generarToken,cambiarContraseñaEnDB } = require('../models/loginModel.js');
const fs = require('fs'); // Importa el módulo fs tradicional
const fsPromises = fs.promises; // Importa el módulo de promesas de fs
const path = require('path');
const jwt = require('jsonwebtoken');
const { hashearContraseñas} = require("../models/registroUserModel.js")



const login = async (req, res) => {
    const { userEmail, userContraseña } = req.body;

    try {
        const result = await getUserByEmail(userEmail);

        if (result.length > 0) {
            const contraGuardada = result[0].contraseña;
            try {
                const contras = await compararContraseñas(userContraseña, contraGuardada);
                if (contras) {
                    console.log("La contraseña es correcta");
                    const id = result[0].id_unico;
                    console.log("abriendo", id);
                    req.session.userId = id;
                    res.status(200).json({ mensaje: "Inicio de sesión exitoso", data: id });
                } else {
                    console.log("La contraseña es incorrecta");
                    res.status(404).json({ mensaje: 'La contraseña es incorrecta', error: 1 });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error en el servidor vuelva a intentarlo' });
            }
        } else {
            res.status(404).json({ mensaje: 'El usuario no se encuentra registrado', error: 2 });
        }
    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).send("Error en el servidor");
    }
};


const emailTemplatePath = path.join(__dirname, '../../public/correos', 'emailCambiarContra.html');
const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');


const urlVerificacion = `${process.env.URL}/usuario/recuperar.html`;

const verificarUsuario = async (req, res) => {
    try {
        const correo = req.body.correo;
        console.log(correo);

        const usuarioExiste = await verificarEmail(correo);
        console.log(usuarioExiste);

        if (usuarioExiste) {
            const token = generarToken(correo);
            const enlace = `${urlVerificacion}?token=${token}`;
            await enviarCorreoCambiarContra(correo, enlace, emailTemplate);
            res.status(200).json({ mensaje: "Te enviamos un correo, con el enlace para cambiar la contraseña" });
        } else {
            res.status(400).json({ mensaje: "El usuario no existe" });
        }
    } catch (error) {
        console.error("Error en verificarUsuario:", error);
        res.status(500).json({ mensaje: "Ocurrió un error al procesar tu solicitud" });
    }
};


const secretKey = process.env.SECRET_KEY;


const verificarToken = (req, res) => {
    try {
        const token = req.query.token;

        if (!token) {
            return res.status(400).json({ mensaje: "Token no proporcionado" });
        }

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(400).json({ mensaje: "Token inválido o expirado" });
            }

            console.log("Correo decodificado:", decoded.correo);

            const filePath = path.join(__dirname, '../../public', 'recuperar.html');
            fs.readFile(filePath, 'utf8', (err, html) => {
                if (err) {
                    console.error("Error al leer el archivo HTML: ", err);
                    return res.status(500).send("Error en el servidor");
                }

                const htmlConCampos = html.replace('%=correo%>', decoded.correo);
                res.send(htmlConCampos);
            });
        });
    } catch (error) {
        console.error("Error al verificar el token de cambiar contraseña", error);
        res.status(500).json({ mensaje: "Ocurrió un error al procesar tu solicitud" });
    }
};


const cambiarContraseña = async(req,res)=>{
    try {
        console.log(req.body)
        const contaseña =  await hashearContraseñas(req.body.contraseña)
        const correo = req.body.correo
        const resultado =  await cambiarContraseñaEnDB(contaseña,correo)
        if (resultado.success) {
            res.status(200).json({ mensaje: resultado.message });
        } else {
            res.status(400).json({ mensaje: resultado.message });
        }
        console.log(resultado.message)
    } catch (error) {
        console.error('Error en cambiarContraseña:', error);
        res.status(500).json({ mensaje: 'Ocurrió un error al procesar tu solicitud' });
    }
};


module.exports = {
    login,
    verificarUsuario,
    verificarToken,
    cambiarContraseña
};
