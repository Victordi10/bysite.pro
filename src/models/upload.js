
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Función para crear almacenamiento de logos
function createStorage(getIdUnico, getNegocioNombre) {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            if (file) {
                const id_unico = getIdUnico(req);
                const negocioNombre = getNegocioNombre(req).replace(/\s+/g, '_');
                const uploadPath = path.join(__dirname, `usuarios/${id_unico}/${negocioNombre}/logo`);

                // Verificar si el directorio existe, si no, crearlo
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }

                console.log("Ruta del directorio a guardar la imagen:", uploadPath);
                cb(null, uploadPath);
            } else {
                cb(null, '');
            }
        },
        filename: (req, file, cb) => {
            const negocioNombre = getNegocioNombre(req).replace(/\s+/g, '_');
            const nombreArchivo = `${negocioNombre}Logo.jpg`;
            cb(null, nombreArchivo);
        }
    });
}

// Crear instancias de almacenamiento para cada caso
const storage = createStorage(req => req.body.id_unico, req => req.body.negocioNombre);
const storageAct = createStorage(req => req.params.id_unico_dueno, req => req.params.negocioNombre);

// Crear instancias de multer
const upload = multer({ storage: storage });
const uploadAct = multer({ storage: storageAct });

module.exports = {
    upload,
    uploadAct
};