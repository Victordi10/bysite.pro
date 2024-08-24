const fs = require('fs');
const path = require('path');

const {
    obtenerCorreo,
    obtenerCantidadNegocios,
    obtnerNegocios,
    eliminarArchivosNegocio,
    eliminarProductosNegocio,
    eliminarNegocio,
    almacenarNegocioLogoDB,
    actualizarDatosNegocio,
    obtenerTipografias,
    ajustarNumeroWhatsApp,
    actualizarSubdominio,
    validarYNormalizarSubdominio,
    verificarSubdominio,
    actualizarDatosCatalogo,
    borrarArchivoDB,
    borrarArchivo,
    obtenerTiposNegocios} = require('../models/negocioModel');

    const {obtenerSuscribcion,obtenerNegociosCanPlan} = require('../middlewares/verificarPlan.js')


//data de mensaje
const data = {}
//verificasesion frontend
const verificaSesionFron =(req,res)=>{
    if (req.session && req.session.userId) {
        console.log("Hay sesion")
        res.status(200).json({sesion:true})
    } else {
        console.log("no Hay sesion ")
        res.status(403).json({sesion:false})
    }
}


async function panel(req, res) {
    try {
        const id_unico = req.params.id_unico;
        
        // Obtener suscripción
        const suscripcion = await obtenerSuscribcion(id_unico);
        if (!suscripcion) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        
        // Obtener correo
        const correo = await obtenerCorreo(id_unico);
        if (!correo) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        // Leer el archivo HTML del panel de forma asíncrona
        fs.readFile(path.join(__dirname, '../../public', 'panel.html'), 'utf8', (err, html) => {
            if (err) {
                console.error("Error al leer el archivo HTML: ", err);
                return res.status(500).json({ mensaje: "Error en el servidor" });
            }
            
            // Inyectar los valores en el HTML
            const htmlWithData = html
                .replace('%= id_unico %>', id_unico)
                .replace('%=suscripcion%>', suscripcion)
                .replace('%=usuarioCorreo%>', correo);
            res.send(htmlWithData);
        });
    } catch (error) {
        console.error("Error al enviar el panel", error);
        res.status(500).json({ mensaje: "Error al enviar el panel" });
    }
}
//envio las tipografias
const enviarTipografias = async(req,res)=>{
    try {
        const tipografias = await obtenerTipografias();
        //console.log("tipografiasssssss",tipografias)
        data.tipografias = tipografias
        res.status(200).json(data.tipografias)
    } catch (error) {
        console.error("Error al cargar las tipografias",error)
        res.status(500).send("error al cargar las tipografias")
    }
}

const crearNegocios = async (req, res) => {
    const idUnico = req.params.id_unico;
    const negocioNombre = req.body.negocioNombre.replace(/\s+/g, '_').toLowerCase().trim();
    try {
        // Obtener el ID del negocio del middleware
        const negocioId = req.negocioId;

        // Enviar respuesta al cliente
        res.status(201).json({ mensaje: "El negocio se creó correctamente", nombre: negocioNombre, logo: `negocio_${negocioId}/logo.jpg`, descripcion: req.body.negocioDesc });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).send("Error en el servidor");
    }
}

//verifico si puedo crear mas negocios antes de poder llenar el formulario
const verificarCantidadNegocios = async(req,res)=>{
    try {
        console.log("id: ",req.params.id_unico_dueno)
        console.log("verificando...")
        // Verificar suscripción
        const suscripcion = await obtenerSuscribcion(req.params.id_unico_dueno)
        const negociosCanPlan = await obtenerNegociosCanPlan(suscripcion)
        console.log("suscripcion",suscripcion,negociosCanPlan)

        // Verificar cantidad de negocios del usuario
        const verificarcantidadNegocios = await obtenerCantidadNegocios(req.params.id_unico_dueno);
        console.log("verificarcantidadNegocios",verificarcantidadNegocios)

        if (verificarcantidadNegocios >= negociosCanPlan) {
        console.log("entro")
        console.error("no se pueden crear mas negocios: " ,negociosCanPlan)
            data.mensaje = "No se pueden crear mas negocios"
            return res.status(403).json(data);
        }
        else {
            console.log(" se puede crear mas negocios") ;
            data.mensaje = "si puede crear un nuevo negocio"
            res.status(200).json(data)
        }
    } catch (error) {
            data.mensaje = "Error al verificar la cantidad de negocios"
            res.status(500).json(data)
    }
    
}

//obtener negocios
const obtenerNegocios = async (req,res)=>{
    const id_unico = req.query.id_unico
    try {
        const negocios = await obtnerNegocios(id_unico)
        console.log("los negocios se cargaron correctamente, negocios: ",negocios.length)
        res.status(200).json(negocios)
    } catch (err) {
        //mensaje de respuesta
        data.mensaje = "error en la consulta"
        res.status(501).json(data)
        console.error("error al consultar los negocios: ",err)
    }
}

//logica para eliminar negocios por id y el id_unico para borrar los archivos y el nombre de la tabla para eliminar la tabla de negocio
const eliminarNegocios = async (req,res)=>{
    const {id_unico_dueno,negocio_id} = req.params
    const negocioNombre = req.params.negocioNombre.replace(/\s+/g, '_').toLowerCase()
    console.log("Eliminando negocio para",id_unico_dueno,"Nombre e id",negocioNombre,negocio_id)
    try {
        //archivos
        const archivosBorrar = await eliminarArchivosNegocio(id_unico_dueno,negocio_id)
        console.log(archivosBorrar)
        //tabla
         const productosNegocioBorrar = await eliminarProductosNegocio(negocio_id)
        console.log(productosNegocioBorrar) 
        //negocio
        const negocioBorrar = await eliminarNegocio(negocio_id)
        console.log(negocioBorrar)
        //mensaje de respuesta
        data.mensaje = negocioBorrar
        res.status(200).json(data)
        
    } catch (error) {
        console.error(error)
        //mensaje de respuesta
        data.mensaje = "error al intentar eliminar el negocio"
        res.status(500).json(data)
    }

}

const actualizarCatalogo = async(req,res)=>{
    try {
        const { id_unico_dueno, idNegocios } = req.params;
        console.log("datos", req.body);

        const values = [
            req.body.negocioTituloInput, req.body.colorUnoInput, req.body.colorDosInput, req.body.colorFondoInput, req.body.negocioFuenteSelect, idNegocios
        ];

        // Actualizo los datos en la base de datos
        const negocioDatos = await actualizarDatosCatalogo(values);
        console.log(negocioDatos);

        // Mensaje de respuesta
        data.mensaje = `Los datos se actualizaron con éxito`;
        res.status(200).json(data);
    } catch (error) {
        console.error("Error al intentar actualizar los datos del catalogo:", error);
        // Mensaje de respuesta
        data.mensaje = "Error al intentar actualizar los detalles del catalogo";
        res.status(500).json(data);
    }
}
const actualizarNegocio = async (req, res) => {
    try {
        const { id_unico_dueno, idNegocios } = req.params;
        console.log("datos", req.body);

        // Obtengo los datos del body
        const negocioNombreInput = req.body.negocioNombreInput.replace(/\s+/g, '_').toLowerCase().trim();
        const negocioDescInput = req.body.negocioDescInput;
        let negocioCorreoInput;
        let negocioInstagramInput;
        let negocioWhatsAppInput = ajustarNumeroWhatsApp(req.body.negocioWhatsAppInput); // Ajustar el número de WhatsApp
        let negocioFacebookInput;
        let negocioTiktokInput;
        let negocioYoutubeInput;

        const suscripcion = await obtenerSuscribcion(id_unico_dueno);
        if (suscripcion > 1) {
            negocioCorreoInput = req.body.negocioCorreoInput;
            negocioInstagramInput = req.body.negocioInstagramInput;
            negocioFacebookInput = req.body.negocioFacebookInput;
            negocioTiktokInput = req.body.negocioTiktokInput;
            negocioYoutubeInput = req.body.negocioYoutubeInput;
        } else {
            negocioCorreoInput = null;
            negocioInstagramInput = null;
            negocioFacebookInput = null;
            negocioTiktokInput = null;
            negocioYoutubeInput = null;
        }

        const values = [
            negocioNombreInput, negocioDescInput, negocioCorreoInput, negocioWhatsAppInput, negocioInstagramInput, negocioFacebookInput, negocioTiktokInput, negocioYoutubeInput, idNegocios
        ];

        // Actualizo los datos en la base de datos
        const negocioDatos = await actualizarDatosNegocio(values);
        console.log(negocioDatos);

        // Mensaje de respuesta
        data.mensaje = `Los datos se actualizaron con éxito`;
        res.status(200).json(data);

    } catch (error) {
        console.error("Error al intentar actualizar los datos del negocio:", error);
        // Mensaje de respuesta
        data.mensaje = "Error al intentar actualizar los detalles del negocio";
        res.status(500).json(data);
    }
};
const guardarSubdominio = async (req, res) => {
    try {
        const negocioID = req.params.negocioID;
        const subdominio = req.body.subdominio;
        const id_unico = req.params.id_unico_dueno

        // Validar y normalizar el subdominio
        const { esValido, subdominio: subdominioNormalizado, mensaje } = validarYNormalizarSubdominio(subdominio);
        if (!esValido) {
            return res.status(400).json({ mensaje: mensaje });
        }

        // Verificar si el subdominio ya existe en la base de datos
        const existeSubdominio = await verificarSubdominio(subdominioNormalizado, negocioID);
        if (existeSubdominio === 0) {
            const suscripcion = await obtenerSuscribcion(id_unico);
            if(suscripcion > 1){
                await actualizarSubdominio(negocioID, subdominioNormalizado);
                return res.status(200).json({ mensaje: "Subdominio guardado" });
            }else{
                return res.status(403).json({ mensaje: "Suscribete y podras cambiarlo" });
            }
        } else {
            return res.status(403).json({ mensaje: "Link no disponible" });
        }
    } catch (error) {
        console.error("Error al guardar el subdominio", error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
}
const validarSubdominio = async (req, res) => {
    try {
        const negocioID = req.params.negocioID;
        let subdominio = req.body.subdominio;

        // Verificar y normalizar restricciones de subdominio
        const restricciones = validarYNormalizarSubdominio(subdominio);
        if (!restricciones.esValido) {
            return res.status(400).json({ mensaje: restricciones.mensaje });
        }
        subdominio = restricciones.subdominio; // Actualizar con el subdominio normalizado

        // Verificar si el subdominio ya existe en la base de datos
        const existeSubdominio = await verificarSubdominio(subdominio, negocioID);
        if (existeSubdominio === 0) {
            res.status(200).json({ mensaje: "Se puede guardar" });
        } else {
            res.status(403).json({ mensaje: "Este subdominio ya existe" });
        }
    } catch (error) {
        console.error("Error al validar el subdominio", error);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
};
    
// Elimina la foto de portada y verifica si todo se realizó correctamente
const eliminarFotoPortada = async (req, res) => {
    try {
        const { id_unico_dueno, negocioID } = req.params;
        // Primero, borra el archivo
        const archivoBorrado = await borrarArchivo(negocioID, id_unico_dueno);
        if (archivoBorrado) {
            // Luego, actualiza la base de datos si el archivo se borró
            await borrarArchivoDB(negocioID);
            res.status(200).json({ message: "Foto de portada eliminada con éxito." });
        } else {
            res.status(404).json({ message: "El archivo de portada no se encontró." });
        }
    } catch (error) {
        console.error("Error al eliminar la foto de portada:", error);
        res.status(500).json({ message: "Error al eliminar la foto de portada." });
    }
};

//logica para actualizar el logo del negocio
const actualizarLogoNegocio =async (req, res) => {
    console.log("Actualizando logo del negocio...");
    // Obtener los parámetros
    const id_unico_dueno = req.params.id_unico_dueno;
    const negocioLogo = req.file;
    const negocioNombre = req.params.negocioNombre.replace(/\s+/g, '_');
    const negocioID = req.params.negocioID
    const rutaRelativaLogo = req.file ? `negocio_${negocioID}/logo.jpg` : null;
    try {
        const almacenarLOgo = await almacenarNegocioLogoDB(rutaRelativaLogo,negocioID)
        if(almacenarLOgo){
            data.mensaje = "Se actualizó correctamente la foto"
            const timestamp = new Date().getTime()
            data.src = `${rutaRelativaLogo}?timestamp=${timestamp}`
            res.status(200).json(data);
        }
        
    } catch (error) {
        // Manejar cualquier error que ocurra durante el proceso
        console.error("Error al actualizar el logo del negocio:", error);
        //mensaje de respuesta
        data.mensaje = "Error al actualizar la foto"
        // Enviar respuesta de error
        res.status(500).json(data);
    }
}

const cerrarSesion =async (req, res) => {
    // Destruir la sesión actual
    req.session.destroy((err) => {
        if (err) {
            const data = {
                mensaje:"Error al cerrar sesión ERROR 500"
            }
            console.error("Error al cerrar sesión:", err);
            res.status(500).json(data);
        } else {
            // Redirigir al usuario a la página de inicio de sesión
            res.redirect("/login.html");
        }
    });
};

const enviarTiposNegocios = async (req, res) => {
    try {
        const tiposNegocios = await obtenerTiposNegocios();
        console.log(tiposNegocios)
        res.status(200).json(tiposNegocios);  // Asegúrate de que el objeto tiene la clave correcta
    } catch (error) {
        console.error("Error al enviar los tipos de negocios", error);
        res.status(500).send("No se logró enviar los tipos de negocios");
    }
};

module.exports = {
    actualizarLogoNegocio,
    actualizarNegocio,
    eliminarNegocios,
    obtenerNegocios,
    verificarCantidadNegocios,
    crearNegocios,
    panel,
    enviarTipografias,
    cerrarSesion,
    verificaSesionFron,
    guardarSubdominio,
    validarSubdominio,
    enviarTiposNegocios,
    actualizarCatalogo,
    eliminarFotoPortada
};