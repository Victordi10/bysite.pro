const express = require("express");
const router = express.Router();
const { procesarPago, obtenerBancosPSE,suscribirUsuarios,cancelarSuscripcionUsuario } = require("../controllers/suscripcionCrontroller.js");
const { verificarSesion } = require('../middlewares/verificarSesion.js');

router.post("/suscribirse_bysite",verificarSesion,suscribirUsuarios)
router.delete("/cancelar-suscripcion",verificarSesion,cancelarSuscripcionUsuario)


/* // Ruta para mostrar la página de venta del catálogo
router.post("/process_payment", procesarPago); */

/* // Ruta para obtener los bancos disponibles para PSE
router.get("/payment_methods", obtenerBancosPSE);

// Ruta para procesar el pago por PSE
router.post('/v1/payments', procesarPagoPSE); */

module.exports = router;
