const { Payment, MercadoPagoConfig } = require("mercadopago");
const { executeQuery } = require("../db");
const fs = require('fs'); // Importa el módulo fs tradicional
const fsPromises = fs.promises; // Importa el módulo de promesas de fs
const path = require('path');
const fetch = require("node-fetch");

//produccion
const accessToken = "token-mercadopago";
//prueba
//const accessToken = "fvf";
//url de exito de suscripcion exitosa
const urlExito = "https://www.yoursite.com"


// Función para crear un plan de suscripción en MercadoPago
const crearPlanSuscripcion = async (plan) => {
  try {
    const response = await fetch(
      "https://api.mercadopago.com/preapproval_plan",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: plan.descripcion,
          auto_recurring: {
            frequency: plan.frecuencia,
            frequency_type: plan.tipoFrecuencia,
            billing_day: plan.diaFacturacion,
            billing_day_proportional: true,
            transaction_amount: plan.precio,
            currency_id: "COP",
          },
          payment_methods_allowed: {
            payment_types: [],
            payment_methods: [],
          },
          back_url: urlExito,
        }),
      }
    );
    const data = await response.json();
    console.log(`Plan '${plan.nombre}' creado:`, data);
    return data.id;
  } catch (error) {
    console.error(`Error al crear el plan '${plan.nombre}':`, error);
    throw error;
  }
};

// Función para actualizar el ID del plan de MercadoPago en la base de datos
const actualizarIDPlanMercadoPago = async (planes) => {
  try {
    const sql = "SELECT * FROM planes";
    const planesExistentes = await executeQuery(sql);

    for (let planDB of planes) {
      const planExistente = planesExistentes.find(p => p.planes_id === planDB.idPlanDB);
      if (planExistente && !planExistente.id_mercadopago) {
        const idMercadoPago = await crearPlanSuscripcion(planDB);
        const updateSql = 'UPDATE planes SET id_mercadopago = ? WHERE planes_id = ?';
        await executeQuery(updateSql, [idMercadoPago, planDB.idPlanDB]);
        planDB.idPlan_MP = idMercadoPago;
        console.log(`ID de MercadoPago actualizado para el plan '${planDB.nombre}': ${idMercadoPago}`);
      } else if (planExistente) {
        planDB.idPlan_MP = planExistente.id_mercadopago;
        console.log(`El plan '${planDB.nombre}' ya tiene un ID de MercadoPago: ${planExistente.id_mercadopago}`);
      }
    }
  } catch (error) {
    console.error("Error al actualizar los IDs de MercadoPago:", error);
  }
};

// Función para obtener el id_mercadopago de manera asincrónica
const obtenerId_mercadopago = (idPlan) => {
  const sql = "SELECT id_mercadopago FROM planes WHERE planes_id = ?";
  return executeQuery(sql, [idPlan])
    .then(result => result[0].id_mercadopago)
    .catch(err => {
      console.error("Error al obtener el id_mercadopago", err);
      throw err; // Para manejar el error más arriba en la cadena de promesas
    });
};

const obtenerIDUsuario = (correo)=>{
  const sql = 'SELECT id FROM usuarios WHERE correo = ?'
  return executeQuery(sql,correo)
  .then(id=> id[0].id)
  .catch(err => {'error al obtener el id del usuario para la suscripcion', err})
}
const suscribirUsuario = async (descripcionPlan, precioPlan, idPlanMercadoPago, idPlanDB, idUsuario, token, email) => {
  try {
    if (idUsuario == undefined) {
      idUsuario = 33;
    }

    console.log("Datos a enviar:");
    console.log({
      Authorization: `Bearer ${accessToken}`,
      preapproval_plan_id: idPlanMercadoPago,
      reason: `Suscripción a ${descripcionPlan}`,
      external_reference: idUsuario,
      payer_email: email,
      card_token_id: token,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        start_date: new Date().toISOString(),
        end_date:new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        transaction_amount: precioPlan,
        currency_id: "COP",
      },
      back_url: urlExito,
      status: "authorized",
    });

    const response = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        preapproval_plan_id: idPlanMercadoPago,
        reason: `Suscripción a ${descripcionPlan}`,
        external_reference: idUsuario,
        payer_email: email,
        card_token_id: token,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          start_date: new Date().toISOString(),
          end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
          transaction_amount: precioPlan,
          currency_id: "COP",
        },
        back_url: urlExito,
        status: "authorized",
      }),
    });

    const data = await response.json();
    console.log(response.status);
    console.log(response);
    console.log(data);
    const id_suscripcion = data.id
    console.log("funciona",id_suscripcion);
    let resultado ={
      suscripcion: true,
      status:response.status
    }
    if (response.ok || response.status == 201) {
      //actualizo el plan en mi db y el id de suscripcion
      const sql = "UPDATE usuarios SET suscripcion = ? , id_suscripcion = ?, seSuscribio = ? WHERE correo = ?";
      executeQuery(sql, [idPlanDB, id_suscripcion, new Date().toISOString(), email])
      .then(exito=>{
        return resultado 
      }).catch(err=>{
        console.error("No se registro el usuario en la base de datos",err)
      })
      return resultado 
    } else {
      console.error("Error al suscribir el usuario:", data);
      resultado.suscripcion = false 
      return resultado;
    }
  } catch (error) {
    console.error("Error al suscribir al usuario:", error);
    return false;
  }
};


const cancelarSuscripcion = async (descripcionPlan, precioPlan, id_suscripcion, idUsuario) => {
  const url = `https://api.mercadopago.com/preapproval/${id_suscripcion}`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };

  const dataBody = {
    auto_recurring: {
      transaction_amount: precioPlan,
      currency_id: "COP"
    },
    back_url: "https://bysite.pro/login.html",
    card_token_id: 123123123,  // Aquí debes poner el ID real del token de tarjeta
    external_reference: idUsuario,  // Aquí debes poner el ID externo real de la referencia
    reason: descripcionPlan,
    status: "cancelled"
  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(dataBody)
    });

    const responseData = await response.json();
    console.log(response)
    console.log(responseData)

    let resultado = {
      cancelada: true,
      status: response.status
    };

    if (!response.ok && response.status !== 201) {
      console.error("Error al cancelar la suscripción:", responseData);
      resultado.cancelada = false;
      resultado.mensaje = responseData.mesaje
    }
    return resultado;
  } catch (error) {
    console.error('Error al cancelar la suscripción:', error);
    throw error;
  }
};

const cancelarSuscripcionDB =(subscriptionId)=>{
  const sql = "UPDATE usuarios SET suscripcion = ?, id_suscripcion = ?, seSuscribio = ? WHERE id_suscripcion = ?";
  return executeQuery(sql, [1, null, new Date().toISOString(), subscriptionId])
    .then(() => {
      console.log("Datos de cancelación registrados correctamente en la base de datos");
    })
    .catch(err => {
      console.error("Error al registrar los datos de cancelación en la base de datos", err);
      throw err;
    });
}


const enviarCorreoCancelacion = (correoUser, fechaCancelacion, nombrePlan) => {
  const placeholders = {
    fechaCancelacion,
    nombrePlan
  };

  const emailCancelacion = path.join(__dirname, '../../public/correos', 'emailCancelacion.html');
  const emailTemplate = fs.readFileSync(emailCancelacion, 'utf8');

  return enviarCorreo({
      correoUser,
      subject: 'Cancelación de Suscripción',
      template: emailTemplate,
      placeholders
  });
};
const enviarCorreoSuscripcion = (correoUser, nombrePlan) => {
 /*  const placeholders = {
    nombrePlan
  }; */
  const emailSuscripcion = path.join(__dirname, '../../public/correos', 'emailSuscripcion.html');
  const emailTemplate = fs.readFileSync(emailSuscripcion, 'utf8');

  return enviarCorreo({
      correoUser,
      subject: `Suscripción a ${nombrePlan}`,
      template: emailTemplate,
      //placeholders
  });
};

const obtenerCorreo_y_plan = (id_suscripcion)=>{
  const sql = 'SELECT u.correo, u.suscripcion, p.plan_nombre FROM usuarios u INNER JOIN planes p ON u.suscripcion = p.id WHERE u.id_suscripcion = ?';
  return executeQuery(sql, id_suscripcion)
  .then(result=> result[0])
  .catch(err=>{
    console.error("Error al obtener el correo y el plan")
    throw err;
  })
}

module.exports = {
  crearPlanSuscripcion,
  actualizarIDPlanMercadoPago,
  suscribirUsuario,
  cancelarSuscripcion,
  obtenerIDUsuario,
  obtenerId_mercadopago,
  cancelarSuscripcionDB,
  enviarCorreoCancelacion,
  obtenerCorreo_y_plan,
  enviarCorreoSuscripcion
}
