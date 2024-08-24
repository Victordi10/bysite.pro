const express = require('express');
const router = express.Router();
const { cancelarSuscripcionDB, enviarCorreoCancelacion, enviarCorreoSuscripcion, obtenerCorreo_y_plan } = require("../models/suscripcionModel.js");
const {obtenerFechaActual} = require("../middlewares/general.js")


router.post('/webhook', async (req, res) => {
    try {
        const evento = req.body;
        const fecha = obtenerFechaActual();
        const accion = evento.action;
        const subscriptionId = evento.data.id;

        console.log("Accion:", accion, "ID:", subscriptionId);

        if (evento.type === 'subscription') {
            const datos = await obtenerCorreo_y_plan(subscriptionId);

            switch (accion) {
                case 'created':
                    console.log(`Suscripción ${subscriptionId} fue creada.`);
                    await enviarCorreoSuscripcion(datos.correo, datos.plan_nombre);
                    await enviarCorreoAdmin(`Suscripción a ${datos.plan_nombre}`, datos.correo, fecha, datos.plan_nombre, null);
                    break;
                case 'cancelled':
                    console.log(`Suscripción ${subscriptionId} fue cancelada.`);
                    await enviarCorreoCancelacion(datos.correo, fecha, datos.plan_nombre);
                    await cancelarSuscripcionDB(subscriptionId);
                    await enviarCorreoAdmin("Cancelación de Suscripción", datos.correo, fecha, datos.plan_nombre, null);
                    break;
                default:
                    console.log(`Acción de suscripción desconocida: ${accion}`);
                    break;
            }
        } else {
            console.log(`Tipo de evento desconocido: ${evento.type}`);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('Error al procesar notificación de Mercado Pago:', error);
        res.status(500).send('Error interno al procesar la notificación');
    }
});

module.exports = router;
