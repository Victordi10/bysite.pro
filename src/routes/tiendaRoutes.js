const express = require('express')
const router = express.Router()

const {datosNegocios,linkAnterior} = require("../controllers/tiendaController")
const {negociosAll}= require("../models/tiendaModel.js")

router.use(express.json())
// Rutas para la página de venta
router.get("/negocio/:negocioNombre/:idNegocio", linkAnterior);

router.get("/negocio/obtener", datosNegocios);

router.get("/sites/all", async (req, res) => {
    try {
        const negocios = await negociosAll();
        res.status(200).json({ data: negocios });
    } catch (error) {
        console.error("Error al enviar todos los negocios", error);
        res.status(500).json({ mensaje: "Error al enviar todos los negocios" });
    }
});



 module.exports = router
