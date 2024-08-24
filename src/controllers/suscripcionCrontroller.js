
const {obtenerDatosCancelarSuscripcion} = require("../middlewares/verificarPlan")
const {obtenerFechaActual} = require("../middlewares/general.js")
const { obtenerId_mercadopago, 
        actualizarIDPlanMercadoPago, 
        suscribirUsuario, 
        cancelarSuscripcion, 
        obtenerIDUsuario,
        cancelarSuscripcionDB,
        enviarCorreoCancelacion,
        enviarCorreoSuscripcion,
        obtenerCorreo_y_plan } = require("../models/suscripcionModel.js");



const data = {}
// Función principal que usa async/await para configurar los planes
const configurarPlanes = async () => {
  try {
    // Crear un array de promesas para obtener los IDs de MercadoPago
    const promesasPlanes = [
      obtenerId_mercadopago(2),
      obtenerId_mercadopago(3),
      obtenerId_mercadopago(4)
    ];

    // Esperar a que todas las promesas se resuelvan
    const idsPlanesMP = await Promise.all(promesasPlanes);

    // Construir el array de planes con los IDs resueltos
    const planes = [
      {
        nombre: "Plan Básico",
        precio: 50000,
        descripcion: "Plan básico de bysite pro",
        frecuencia: 1,
        tipoFrecuencia: "months",
        diaFacturacion: 1,
        idPlanDB: 2,
        idPlan_MP: idsPlanesMP[0]
      },
      {
        nombre: "Plan Emprendedor",
        precio: 100000,
        descripcion: "Plan emprendedor de bysite pro",
        frecuencia: 1,
        tipoFrecuencia: "months",
        diaFacturacion: 1,
        idPlanDB: 3,
        idPlan_MP: idsPlanesMP[1]
      },
      {
        nombre: "Plan Empresario",
        precio: 120000,
        descripcion: "Plan empresario de bysite pro",
        frecuencia: 1,
        tipoFrecuencia: "months",
        diaFacturacion: 1,
        idPlanDB: 4,
        idPlan_MP: idsPlanesMP[2]
      }
    ];

    console.log(planes);

    // Aquí puedes llamar a actualizarIDPlanMercadoPago si es necesario
    await actualizarIDPlanMercadoPago(planes);

    return planes;
  } catch (error) {
    console.error("Error en el proceso principal:", error);
    throw error;
  }
};

// Llamar a la función de configuración y exportar los planes
let planesConfigurados;
configurarPlanes().then(planes => {
  planesConfigurados = planes;
}).catch(err => {
  console.error("Error al configurar los planes:", err);
});

// Función para suscribir usuarios
const suscribirUsuarios = async (req, res) => {
  try {
    const { token, payer: { email, planSeleccionado } } = req.body;
    let descripcionPlan, precio, idPlanMercadoPago;
    const idPlanDB = parseInt(planSeleccionado);

    if (!planesConfigurados) {
      return res.status(500).send("Los planes no están configurados");
    }

    if (idPlanDB === 2) {
      idPlanMercadoPago = planesConfigurados[0].idPlan_MP;
      descripcionPlan = planesConfigurados[0].descripcion;
      precio = planesConfigurados[0].precio;
    } else if (idPlanDB === 3) {
      idPlanMercadoPago = planesConfigurados[1].idPlan_MP;
      descripcionPlan = planesConfigurados[1].descripcion;
      precio = planesConfigurados[1].precio;
    } else if (idPlanDB === 4) {
      idPlanMercadoPago = planesConfigurados[2].idPlan_MP;
      descripcionPlan = planesConfigurados[2].descripcion;
      precio = planesConfigurados[2].precio;
    } else {
      return res.status(400).send("ID de plan no válido");
    }

    const idUsuario = await obtenerIDUsuario(email);
    const suscribir = await suscribirUsuario(descripcionPlan, precio, idPlanMercadoPago, idPlanDB, idUsuario, token, email);

    if (suscribir.suscripcion) {
      data.mensaje = "Suscripción exitosa"
      res.status(200).json(data);
    } else {
      res.status(suscribir.status).send("Suscripción fallida");
    }
  } catch (error) {
    console.error("Error al suscribir el usuario:", error);
    res.status(500).send("Error al procesar la suscripción");
  }
};
const planes = [
  {
    nombre: "Plan Básico",
    precio: 50000,
    descripcion: "Plan básico de bysite pro",
    idPlanDB: 2,
  },
  {
    nombre: "Plan Emprendedor",
    precio: 100000,
    descripcion: "Plan emprendedor de bysite pro",
    idPlanDB: 3,
  },
  {
    nombre: "Plan Empresario",
    precio: 120000,
    descripcion: "Plan empresario de bysite pro",
    idPlanDB: 4,
  }
];

const cancelarSuscripcionUsuario = async(req,res)=>{
  try {
    const correo = req.body.correo
    const datos = await obtenerDatosCancelarSuscripcion(correo)
    let descripcionPlan, precio, idPlanMercadoPago;

    if (datos.suscripcion === 2) {
      descripcionPlan = planes[0].descripcion;
      precio = planes[0].precio;
    } else if (datos.suscripcion === 3) {
      descripcionPlan = planes[1].descripcion;
      precio = planes[1].precio;
    } else if (datos.suscripcion === 4) {
      descripcionPlan = planes[2].descripcion;
      precio = planes[2].precio;
    } else {
      data.mensaje = "El usuario no esta suscripto"
      return res.status(400).json(data);
    }

    const resultado = await cancelarSuscripcion(descripcionPlan, precio, datos.id_suscripcion, datos.idUsuario);
    if(resultado.cancelada){
      data.mensaje = "suscripcion cancelada"
      res.status(200).json(data)
    }else{
      data.mensaje = "No se cancelo la suscripcion"
      if (resultado.status === 400) {
        data.mensaje = `La suscripcion se cancelara al final de la fecha de facturacion`;
      }
      res.status(resultado.status).json(data)
    }
  } catch (error) {
    console.error("Error al cancelar la suscripcion",error)
    data.mensaje = "Ocurrio un error al cancelar la suscripcion"
    res.status(500).json(data)
  }
}


module.exports = {
    suscribirUsuarios,
    cancelarSuscripcionUsuario,
    
};
