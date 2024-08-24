const express = require('express');
const nodemailer = require('nodemailer');
//const correoRouter = express.Router()


// Configurar el transporte para Gmail
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tucorreo@gmail.com',
        pass: 'tucontraseña'
    }
});

// Definir el mensaje de correo electrónico
let mailOptions = {
    from: 'tucorreo@gmail.com',
    to: 'correo_destino@example.com',
    subject: 'Confirmación de Registro',
    html: `
        <html>
            <head>
                <style>
                    /* Estilos CSS */
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #333333;
                    }
                    p {
                        color: #666666;
                    }
                    .button {
                        display: inline-block;
                        background-color: #007bff;
                        color: #ffffff;
                        text-decoration: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>¡Gracias por registrarte!</h1>
                    <p>Por favor, haz clic en el siguiente botón para confirmar tu registro:</p>
                    <a href="https://www.tusitio.com/confirmar" class="button">Confirmar Registro</a>
                </div>
            </body>
        </html>
    `
};

// Enviar el correo electrónico
transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Correo electrónico enviado: ' + info.response);
    }
});


//module.exports = correoRouter