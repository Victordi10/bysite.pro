const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const fs = require('fs'); // Importa el módulo fs tradicional
const fsPromises = fs.promises; // Importa el módulo de promesas de fs
const path = require('path');
const miCorreo = process.env.MI_CORREO;
const miContraseña = process.env.MI_CONTRASENA;

// Función genérica para enviar correos electrónicos
const enviarCorreo = ({ correoUser, subject, template, placeholders }) => {
    return new Promise((resolve, reject) => {
        let renderedEmail = template;
        
        // Reemplazar los placeholders en el template
        for (const key in placeholders) {
            if (placeholders.hasOwnProperty(key)) {
                const placeholder = `{{${key}}}`;
                const value = placeholders[key];
                renderedEmail = renderedEmail.replace(new RegExp(placeholder, 'g'), value);
            }
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: miCorreo,
                pass: miContraseña
            },
            logger: true,
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: miCorreo,
            to: correoUser,
            subject: subject,
            html: renderedEmail
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                reject(`Error al enviar el correo`);
            } else {
                console.log('Correo electrónico enviado: ' + info.response);
                resolve("Correo electrónico enviado");
            }
        });
    });
};
const emailNotificacion = path.join(__dirname, '../../public/correos', 'emailNotificacion.html');
const emailTemplateAdmin = fs.readFileSync(emailNotificacion, 'utf8'); // Usa fs tradicional para leer archivos sincrónicamente

const enviarCorreoAdmin =(accion,correo,fecha,plan,motivo)=>{
    const placeholders = {
        accion,
        correo,
        fecha,
        plan,
        motivo
    };
    return enviarCorreo({
        correoUser:"bysiteprovic@gmail.com",
        subject:'Notificación de Acción en Bysite Pro',
        template: emailTemplateAdmin,
        placeholders
    })
}

module.exports = {
    enviarCorreo,
    enviarCorreoAdmin
};