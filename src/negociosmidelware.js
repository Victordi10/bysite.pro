const express = require('express');
const path = require('path')
const multer = require('multer')
const fs = require('node:fs');
const conexion = require('./db')
const session = require('express-session')
const negocio = express.Router()

negocio.use(express.json())
//configuro session
negocio.use(session({
    secret: 'mi_secreto', // Clave secreta para firmar la cookie de sesión
    resave: false,
    saveUninitialized: true
}));

// Middleware que verifica la cantidad de negocios
function verificoCantidadNegocios(idUsuario_unico) {
    return function(req, res, next) {
        const sql2 = 'SELECT * FROM negocios WHERE id_unico_dueno = ?';
        conexion.query(sql2, idUsuario_unico, (err, filas) => {
            if (err) {
                console.error("Error al intentar consultar la cantidad de negocios: ", err);
                res.status(500).send("Error al consultar la cantidad de negocios");
            } else {
                console.log("id: ", idUsuario_unico);
                console.log("Verificando...");
                console.log("El total de negocios: ", filas.length);
                if (filas.length >= 2) {
                    console.error("No se puede crear más negocios");
                    res.status(403).send("No se puede crear más negocios");
                } else {
                    console.log("Se puede crear más negocios");
                    next();
                }
            }
        });
    };
}

// Middleware que verifica si existe un negocio con el mismo nombre
function verificarNegocioMismoNombre(nombreNegocio) {
    return function(req, res, next) {
        const sql = 'SELECT nombre FROM negocios WHERE nombre = ?';
        conexion.query(sql, [nombreNegocio], (err, negocio) => {
            if (err) {
                console.error("Error al intentar verificar si existe un negocio con el mismo nombre: ", err);
                res.status(500).send("Error al verificar si existe un negocio con el mismo nombre");
            } else {
                if (negocio.length >= 1) {
                    console.log("Ya existe un negocio con el mismo nombre", negocio);
                    res.status(400).send("Ya existe un negocio con el mismo nombre");
                } else {
                    next();
                }
            }
        });
    };
}

// Middleware para verificar si el usuario ha iniciado sesión
function verificarSesion(req, res, next) {
    // Verifica si existe un usuario en la sesión
    if (req.session && req.session.userId) {
        // Si el usuario ha iniciado sesión, continúa con la siguiente ruta
        next();
    } else {
        // Si el usuario no ha iniciado sesión, redirige a la página de inicio de sesión
        res.redirect('http://localhost:8020/cuenta/login.html');
    }
}

//logica para cerrar sesion
negocio.get("/panel.html/cerrar", (req, res) => {
    // Destruir la sesión actual
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            res.status(500).send("Error al cerrar sesión");
        } else {
            // Redirigir al usuario a la página de inicio de sesión
            res.redirect("/login.html");
        }
    });
});

//llevo el panel al navegador
negocio.get('/:id_unico',verificarSesion, (req, res) => {
    const id_unico = req.params.id_unico;
    
    // Realizar consulta a la base de datos utilizando el ID único del usuario
    const sql = 'SELECT * FROM usuarios WHERE id_unico = ?';
    conexion.query(sql, id_unico, (err, result) => {
        if (err) {
            console.error("Error en la consulta: ", err);
            res.status(500).send("Error en el servidor");
        } else {
            // Leer el archivo HTML del panel
            fs.readFile(path.join(__dirname, '../public', 'panel.html'), 'utf8', (err, html) => {
                if (err) {
                    console.error("Error al leer el archivo HTML: ", err);
                    res.status(500).send("Error en el servidor");
                } else {
                    // Inyectar el valor de id_unico en el HTML
                    const htmlWithData = html.replace('%= id_unico %>', id_unico);
                    res.send(htmlWithData);
                }
            });
        }
    });
});

//logica para almacenar el logo
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Verificar si se ha enviado un archivo
        if (file) {
            const id_unico = req.body.id_unico;
            const negocioNombre = req.body.negocioNombre.replace(/\s+/g, '_');
            const uploadPath = path.join(__dirname, `usuarios/${id_unico}/${negocioNombre}/logo`);
            /* const uploadPath = path.join(__dirname, `usuarios/${id_unico}/${negocioNombre}/logo`); */

            // Verificar si el directorio existe, si no, crearlo
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true }); // Crear directorio recursivamente
            }

            console.log("Ruta del directorio a guardar la imagen:", uploadPath);
            cb(null, uploadPath);
        } else {
            // Si no se envió un archivo, no almacenar nada
            cb(null, '');
        }
    },
    filename: (req, file, cb) => {
        const negocioNombre = req.body.negocioNombre.replace(/\s+/g,'_')
        // Aquí puedes especificar el nombre del archivo que deseas utilizar
        const nombreArchivo = `${negocioNombre}Logo.jpg`; // Cambia "nombre_personalizado.png" por el nombre que desees

        cb(null, nombreArchivo);
    }
});


const upload = multer({ storage: storage });

// Ruta para agregar un negocio
negocio.post('/:id_unico/panel.html/agregar', verificarSesion, upload.single('negocioLogo'), async (req, res) => {
    console.log(req.params.id_unico);
    try {
        // Verificar cantidad de negocios del usuario
        verificoCantidadNegocios(req.params.id_unico)(req, res, () => {
            // Verificar si ya existe un negocio con el mismo nombre
            verificarNegocioMismoNombre(req.body.negocioNombre.replace(/\s+/g, '_'))(req, res, async () => {
                // Insertar datos del negocio en la base de datos
                const rutaRelativaLogo = req.file ? `${req.body.negocioNombre.replace(/\s+/g, '_')}/logo/${req.body.negocioNombre.replace(/\s+/g, '_')}Logo.jpg` : null;
                const negocioCreado = await crearNegocio(req.body, rutaRelativaLogo, req.params.id_unico);
                // Crear tabla asociada al negocio
                const tablaCreada = await crearTablaNegocio(req.body.negocioNombre);
                // Enviar respuesta al cliente
                res.status(201).json({ mensaje: "El negocio se creó correctamente", nombre: req.body.negocioNombre, logo: rutaRelativaLogo, descripcion: req.body.negocioDesc });
            });
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).send("Error en el servidor");
    }
});



//CREO NEGOCIO EN LA TABLA DE NEGOCIOS
function crearNegocio(datosNegocio, rutaLogo,id_unico_dueno) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO negocios(nombre, logo, descripcion, color_uno, color_dos, id_unico_dueno, correo, telefono_whatsapp, instagram,color_tres) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?,?)';

        const values = [ datosNegocio.negocioNombre.replace(/\s+/g, '_'), rutaLogo, datosNegocio.negocioDesc, datosNegocio.colorUno, datosNegocio.colorDos,id_unico_dueno, datosNegocio.negocioCorreo, datosNegocio.negocioWhatsApp, datosNegocio.negocioInstagram,datosNegocio.colorTres];
        conexion.query(sql, values, (err, filas) => {
            if (err) {
                reject(err);
            } else {
                resolve(filas);
            }
        });
    });
}

function crearTablaNegocio(nombreNegocio) {
    return new Promise((resolve, reject) => {
        const sqlCreaTabla = "CREATE TABLE IF NOT EXISTS ?? (id int PRIMARY KEY AUTO_INCREMENT NOT NULL, producto_nombre VARCHAR(100) NOT NULL, producto_descripcion TEXT, producto_precio DECIMAL(10,2) DEFAULT '0.00', producto_logo VARCHAR(255),categoria VARCHAR(150), producto_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP, negocio_id INT, FOREIGN KEY (negocio_id) REFERENCES negocios(id))";
        const nombreTabla = nombreNegocio.replace(/\s+/g, '_');
        //quitar los guiones bajos
/*         // Reemplazar los guiones bajos por espacios en el nombre del negocio
const nombreConEspacios = nombreSinEspacios.replace(/_/g, ' ');

console.log(nombreConEspacios); // Imprimir el nombre con espacios */
        conexion.query(sqlCreaTabla, [nombreTabla], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}


//verifico si puedo crear mas negocios antes de poder llenar el formulario
negocio.get("/panel.html/negocios/verificar/:id_unico_dueno",(req,res)=>{
    
})

//obtengo los negocios
negocio.get('/panel.html/negocios',verificarSesion,(req,res)=>{
    const id_unico = req.query.id_unico

    const sql = 'SELECT * FROM negocios WHERE id_unico_dueno = ?'
    conexion.query(sql,id_unico,(err,negocios)=>{
        if(err){
            res.status(501).send("error en la consulta")
            console.error("error al consultar los negocios: ",err)
        }else{
            console.log("los negocios se cargaron correctamente, negocios: ",negocios.length)
            res.status(200).json(negocios)
        }
    })
})

//logica para eliminar negocios por id y el id_unico para borrar los archivos y el nombre de la tabla para eliminar la tabla de negocio
negocio.delete("/:id_unico_dueno/:negocioNombre/:negocio_id/eliminar",verificarSesion, async (req,res)=>{
    const {id_unico_dueno,negocioNombre,negocio_id} = req.params
    console.log("Eliminando negocio para",id_unico_dueno,"Nombre e id",negocioNombre,negocio_id)

    try {
        //archivos
        const archivosBorrar = await eliminarArchivosNegocio(id_unico_dueno,negocioNombre.replace(/\s+/g, '_'))
        console.log(archivosBorrar)
        //tabla
        const tablaBorrar = await eliminarTablaNegocio(negocioNombre.replace(/\s+/g, '_'))
        console.log(tablaBorrar)
        //negocio
        const negocioBorrar = await eliminarNegocio(negocio_id)
        console.log(negocioBorrar)
        res.status(200).send(negocioBorrar)
        
    } catch (error) {
        console.error(error)
        res.status(500).send("error al intentar eliminar el negocio")
    }

})
//funcion de eliminar los archivos del negocio
const eliminarArchivosNegocio = (id_unico_dueno,negocioNombre)=>{
    console.log("eliminando archivos del negocio...")
    return new Promise((resolve, reject) => {
        const rutaCarpeta = `usuarios/${id_unico_dueno}/${negocioNombre}`;
        if(fs.existsSync(rutaCarpeta)){
            fs.rm(rutaCarpeta,{recursive: true},(err)=>{
                if(err){
                    console.error(err)
                    reject(`error al eliminar los archivos del negocio`)
                }else{
                    resolve(`la carpeta para del negocio: ${negocioNombre} se ha eliminado correctamente`)
                }
            });
        }else{
            resolve("no existe archivos para: ",negocioNombre)
        }
    })
}
//funcion para eliminar tabla de negocio
const eliminarTablaNegocio = (negocioNombre=>{
    console.log("eliminando tabla del negocio...")
    return new Promise((resolve, reject) => {
        const sql = 'DROP TABLE ??;'
        conexion.query(sql,negocioNombre,(err,resul)=>{
            if(err){
                reject(err)
            }else{
                resolve("tabla del negocio eliminada correctamente")
            }
        })
    })
})
//funcion para eliminar negocio
const eliminarNegocio = (negocio_id)=>{
    console.log("eliminando el negocio...")
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM negocios WHERE id = ?'
        conexion.query(sql,negocio_id,(err,result)=>{
            if(err){
                reject(err)
            }else{
                resolve("El negocio fue eliminado con exito")
            }
        })
    })
}

// Lógica para actualizar el negocio
negocio.put("/:id_unico_dueno/:negocioNombre/:idNegocios/actualizarInfo", async (req, res) => {
    const { id_unico_dueno, negocioNombre, idNegocios } = req.params;
    console.log("Datos", req.body);
    // Obtengo los datos del body
    const nombreOLD = req.body.nombreOLD.replace(/\s+/g, '_');
    const negocioNombreInput = req.body.negocioNombreInput.replace(/\s+/g, '_');
    const negocioDescInput = req.body.negocioDescInput;
    const colorUnoInput = req.body.colorUnoInput;
    const colorDosInput = req.body.colorDosInput;
    const negocioCorreoInput = req.body.negocioCorreoInput;
    const negocioInstagramInput = req.body.negocioInstagramInput;
    const negocioWhatsAppInput = req.body.negocioWhatsAppInput;

    const values = [negocioNombreInput, negocioDescInput, colorUnoInput, colorDosInput, negocioCorreoInput, negocioWhatsAppInput, negocioInstagramInput, idNegocios];
    try {
        // Verificar si existe un negocio con el mismo nombre
        verificarNegocioMismoNombre(negocioNombreInput)(req, res, async () => {
            // Cambio nombre del logo del negocio si hay un nuevo nombre
            if (nombreOLD !== negocioNombreInput) {
                // Cambio nombre del logo
                const negocioLogoNombre = await actializarNegocioLogoNombre(id_unico_dueno, nombreOLD, negocioNombreInput, idNegocios);
                console.log(negocioLogoNombre);
                // Cambio nombre de la carpeta
                const carpetaNegocio = await renombrarCarpetaNegocio(id_unico_dueno, nombreOLD, negocioNombreInput);
                console.log(carpetaNegocio);
                // Cambio el nombre de la tabla de negocio
                const negocioTabla = await actualizarNegocioTabla(nombreOLD, negocioNombreInput);
                console.log(negocioTabla);
            }

            // Actualizo los datos en la base de datos
            const negocioDatos = await actualizarDatosNegocio(values);
            console.log(negocioDatos);
            res.status(200).send(`Los datos se actualizaron con éxito`);
        });
    } catch (error) {
        console.error("Error al intentar actualizar los datos del negocio:", error);
        res.status(500).send("Error al intentar actualizar los detalles del negocio");
    }
});



//funcion para cambiar nombre de foto de producto
const actializarNegocioLogoNombre = (id_unico_dueno, negocioNombreActual,newNegocioNombre, negocioID) => {
    return new Promise((resolve, reject) => {
        const negocioLogo = `usuarios/${id_unico_dueno}/${negocioNombreActual}/logo/${negocioNombreActual}Logo.jpg`;
        const newNegocioLogo = `usuarios/${id_unico_dueno}/${negocioNombreActual}/logo/${newNegocioNombre}Logo.jpg`;

        // Verificar si el archivo original existe antes de intentar renombrarlo
        if (fs.existsSync(negocioLogo)) {
            const rutaRelativa = `${newNegocioNombre}/logo/${newNegocioNombre}Logo.jpg`
            console.log("Cambiando nombre del logo...");
            fs.rename(negocioLogo, newNegocioLogo, (err) => {
                if (err) {
                    console.error("Error al actualizar el nombre del archivo:", err);
                    reject("Error al actualizar el nombre del archivo");
                } else {
                    console.log("Nombre del archivo actualizado correctamente");

                    // Después de cambiar el nombre del archivo, actualiza el nombre en la base de datos
                    const sql = 'UPDATE negocios SET logo = ? WHERE id = ?';
                    conexion.query(sql, [ rutaRelativa, negocioID], (err, result) => {
                        if (err) {
                            console.error("Error al actualizar el nombre del logo en la base de datos:", err);
                            reject("Error al actualizar el nombre del logo en la base de datos");
                        } else {
                            console.log("Nombre del logo en la base de datos actualizado correctamente");
                            resolve("El nombre del archivo y de la imagen en la base de datos se actualizaron correctamente");
                        }
                    });
                }
            });
        } else {
            // Si el archivo original no existe, rechaza la promesa con un mensaje de error
            resolve("El archivo original no existe");
        }
    });
};
//actualizo el nombre de la carpeta de negocio 
const renombrarCarpetaNegocio = (id_unico_dueno,nombreOLD,negocioNombreInput)=>{
    console.log("renombrando carpeta...")
    return new Promise((resolve, reject) => {
        const negocio = `usuarios/${id_unico_dueno}/${nombreOLD}`;
        const newNegocio = `usuarios/${id_unico_dueno}/${negocioNombreInput}`;
        if (fs.existsSync(negocio)) {
            console.log("Cambiando nombre de la carpeta del negocio...");
            fs.rename(negocio, newNegocio, (err)=>{
                if (err) {
                    console.error("Error al actualizar el nombre de la carpeta:", err);
                    reject("Error al actualizar el nombre de la carpeta:", err);
                }else {
                    resolve("Nombre de la carpeta actualizado correctamente");
                }
            })
        }
    })
}
//funcion para renombrar tabla de negocio
const actualizarNegocioTabla = (nombreOLD,negocioNombreInput)=>{
    return new Promise((resolve, reject) => {
        const sql = 'ALTER TABLE ?? RENAME TO ??'
        conexion.query(sql,[nombreOLD,negocioNombreInput],(err,result)=>{
            if(err){
                console.error("error al intentar cambiar el nombre de la tabla de negocio")
                reject("error al intentar cambiar el nombre de la tabla de negocio")
            }else{
                resolve("el nombre de la tabla de negocio se actualizo correctamente")
            }
        })
    })
}

//funcion para actualizar los datos del negocio en la base de datos
//funcion para cambiar en la base de datos
const actualizarDatosNegocio = (values) => {
    return new Promise((resolve, reject) => {
        //almaceno los datos en la base de datos
        const sql = 'UPDATE negocios SET nombre = ?, descripcion = ?, color_uno = ?, color_dos = ?, correo = ?, telefono_whatsapp = ?, instagram = ? WHERE id = ?'
        conexion.query(sql, values, (err, result) => {
            if (err) {
                console.error("Error al actualizar los datos:", err)
                reject("Error al actualizar los datos: " + err.message)
            } else {
                if (result.affectedRows > 0) {
                    resolve("El negocio se actualizó correctamente")
                } else {
                    reject("No se encontró ningún negocio para actualizar")
                }
            }
        })
    })
}

//logica para actualizar el logo del negocio
//logica para actualizar logo
const storageAct = multer.diskStorage({
    destination: (req, file, cb) => {
        // Verificar si se ha enviado un archivo
        if (file) {
            const id_unico_dueno = req.params.id_unico_dueno;
            const negocioNombre = req.params.negocioNombre.replace(/\s+/g, '_');
            const uploadPath = path.join(__dirname, `usuarios/${id_unico_dueno}/${negocioNombre}/logo`);
            /* const uploadPath = path.join(__dirname, `usuarios/${id_unico}/${negocioNombre}/logo`); */

            // Verificar si el directorio existe, si no, crearlo
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true }); // Crear directorio recursivamente
            }

            console.log("Ruta del directorio a guardar la imagen:", uploadPath);
            cb(null, uploadPath);
        } else {
            // Si no se envió un archivo, no almacenar nada
            cb(null, '');
        }
    },
    filename: (req, file, cb) => {
        const negocioNombre = req.params.negocioNombre.replace(/\s+/g,'_')
        // Aquí puedes especificar el nombre del archivo que deseas utilizar
        const nombreArchivo = `${negocioNombre}Logo.jpg`; // Cambia "nombre_personalizado.png" por el nombre que desees

        cb(null, nombreArchivo);
    }
});
const uploadAct = multer({ storage: storageAct });
//actualizar logo
negocio.put("/:id_unico_dueno/:negocioNombre/:negocioID/negocioLogo", uploadAct.single('actualizarArchivo_input'), async (req, res) => {
    console.log("Actualizando logo del negocio...");
    console.log("logo: ",req.params)

    // Obtener los parámetros
    const id_unico_dueno = req.params.id_unico_dueno;
    const negocioLogo = req.file;
    const negocioNombre = req.params.negocioNombre.replace(/\s+/g, '_');
    const negocioID = req.params.negocioID
    const rutaRelativaLogo = req.file ? `${negocioNombre}/logo/${negocioNombre}Logo.jpg` : null;
    try {


        // Aquí puedes agregar la lógica para almacenar la foto en la base de datos, si es necesario
        const sql = 'UPDATE negocios SET logo = ? WHERE id = ?';
        conexion.query(sql, [ rutaRelativaLogo, negocioID], (err, result) => {
            if (err) {
                console.error("Error al actualizar la imagen en la base de datos:", err);
            } else {
                console.log("se actualizo correctamente la imagen en la base de datos");
                res.status(200).send("Se actualizó correctamente la foto");
            }
        });
        // Enviar respuesta de éxito
        

    } catch (error) {
        // Manejar cualquier error que ocurra durante el proceso

        console.error("Error al actualizar el logo del negocio:", error);

        // Enviar respuesta de error
        res.status(500).send("Error al actualizar la foto");
    }
});


module.exports =  negocio ;