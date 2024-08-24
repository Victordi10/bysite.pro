const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const {crearNegocio,actualizarRutaLogo,actualizarCoverFoto,obtenerCantidadNegocios,subdominioPorDefecto}= require('../models/negocioModel')
const {obtenerSuscribcion,obtenerNegociosCanPlan} = require('../middlewares/verificarPlan.js')

// Configurar almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const data = {}
const optimizeAndSaveImage = async (req, res, next) => {
    console.log(req.body,req.params)
    let negocioId = req.body.negocioID || req.params.negocioID
    const id_unico = req.body.id_unico || req.params.id_unico_dueno;
    const negocioNombre = (req.body.negocioNombre || req.params.negocioNombre).trim().replace(/\s+/g, '_').toLowerCase();
    try {
        if(req.method === 'POST'){
   
           // Verificar suscripción
           const suscripcion = await obtenerSuscribcion(id_unico);
           const negociosCanPlan = await obtenerNegociosCanPlan(suscripcion);
   
           // Verificar cantidad de negocios del usuario
           const cantidadNegocios = await obtenerCantidadNegocios(id_unico);
           if (cantidadNegocios >= negociosCanPlan) {
               return res.status(403).send("Ha alcanzado el máximo de negocios permitidos");
           }
   
           // Crear el negocio y obtener su ID
            negocioId = await crearNegocio(req.body, negocioNombre, null, id_unico);
            await subdominioPorDefecto(negocioId,"negocio")
       }

        if (req.file) {
            // Usar el ID del negocio para crear el directorio
            const uploadPath = path.join(__dirname, `../../public/usuarios/${id_unico}/negocio_${negocioId}/`);

            // Verificar si el directorio existe, si no, crearlo
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            const optimizedPath = path.join(uploadPath, 'logo.jpg');

            sharp(req.file.buffer)
                .resize(500) // Redimensionar la imagen
                .jpeg({ quality: 80 }) // Comprimir la imagen
                .toFile(optimizedPath, async (err, info) => {
                    if (err) {
                        console.error('Error al optimizar la imagen:', err);
                        return next(err);
                    }

                    console.log('Imagen optimizada guardada en:', optimizedPath);

                    // Actualizar la ruta del logo en la base de datos
                    await actualizarRutaLogo(negocioId, `negocio_${negocioId}/logo.jpg`);

                    // Pasar el negocioId al siguiente middleware
                    req.negocioId = negocioId;

                    next();
                });
        } else {
            next();
        }
    } catch (error) {
        console.error("Error en optimizeAndSaveImage:", error);
        next(error);
    }
};

const guardarFotoPortada =(req,res)=>{
    try {
        console.log(req.body,req.params)
        let negocioId = req.body.negocioID || req.params.negocioID
        const id_unico = req.body.id_unico || req.params.id_unico_dueno;

        if (req.file) {
            // Usar el ID del negocio para crear el directorio
            const uploadPath = path.join(__dirname, `../../public/usuarios/${id_unico}/negocio_${negocioId}/`);

            // Verificar si el directorio existe, si no, crearlo
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            const optimizedPath = path.join(uploadPath, 'coverfoto.jpg');

            sharp(req.file.buffer)
                .resize(500) // Redimensionar la imagen
                .jpeg({ quality: 80 }) // Comprimir la imagen
                .toFile(optimizedPath, async (err, info) => {
                    if (err) {
                        console.error('Error al optimizar la imagen:', err);
                        return err;
                    }

                    console.log('Imagen optimizada guardada en:', optimizedPath);

                    // Actualizar la ruta del logo en la base de datos
                    await actualizarCoverFoto(negocioId, `negocio_${negocioId}/coverfoto.jpg`);
                    
                    data.mensaje = "Se actualizó correctamente la foto"
                    const rutaRelativaLogo = req.file ? `negocio_${negocioId}/coverfoto.jpg` : null;
                    const timestamp = new Date().getTime()
                    data.src = `${rutaRelativaLogo}?timestamp=${timestamp}`
                    res.status(200).json(data);

                });
        } else {
        }
    } catch (error) {
        console.error("Error en guardarFotoPortada:", error);
        console.error("Error al actualizar la foto del negocio:", error);
        //mensaje de respuesta
        data.mensaje = "Error al actualizar la foto"
        // Enviar respuesta de error
        res.status(500).json(data);
    }
}


module.exports = {
    optimizeAndSaveImage,
    guardarFotoPortada,
    upload
};