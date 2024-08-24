const {executeQuery } = require('../db');


// Verificar suscripción
function obtenerSuscribcion(idUnico) {
    const sql = 'SELECT suscripcion FROM usuarios WHERE id_unico = ?';
    return executeQuery(sql, [idUnico])
        .then(result => result[0].suscripcion)
        .catch(err => {
            console.error("Error al consultar la suscripción", err);
        });
}
function obtenerDatosCancelarSuscripcion(correo) {
    const sql = 'SELECT suscripcion, id_suscripcion, id FROM usuarios WHERE correo = ?';
    return executeQuery(sql, [correo])
        .then(result => result[0])
        .catch(err => {
            console.error("Error al consultar los datos para cancelar la suscripcion", err);
        });
}


const obtenerNegociosCanPlan = (suscripcion)=>{
    const sql = 'SELECT plan_negocios FROM planes WHERE planes_id = ?'
    return executeQuery(sql,[suscripcion])
    .then(negocios => negocios[0].plan_negocios)
    .catch(err=>{
        console.error("error al obtener la cantidad de negocios del plan",err)
    })
}

const obtenerProductoscanPlan = (suscripcion)=>{
    const sql = 'SELECT plan_productos FROM planes WHERE planes_id = ?'
    return executeQuery(sql,[suscripcion])
    .then(productos => productos[0].plan_productos)
    .catch(err=>{
        console.error("error al obtener la cantidad de productos del plan",err)
    })
}


module.exports  = {
    obtenerSuscribcion,
    obtenerNegociosCanPlan,
    obtenerProductoscanPlan,
    obtenerDatosCancelarSuscripcion
}