
//funcion para mostrar el progress bar
//el parametro es el identidicador de donde voy a rembplazar por el progressbar 
const mostrarProgressBar =(contenedor)=>{
    const progressBar = document.querySelector(".progessBar-container")
    progressBar.style.display = "block"

    contenedor.style.display = "none"
}
//funcion para ocultar el progresbar
const ocultarProgressBar =(contenedor)=>{
    const progressBar = document.querySelector(".progessBar-container")
    progressBar.style.display = "none"

    contenedor.style.display = "block"
}

// contenedor de imprimir 
const imprimirMen = document.getElementById('imprimirMen')

//obtengo el boton de enviar el form para ocultarlo por el progresbar
const botonEnviar = document.querySelector(".boton_enviar")

//formulario de verificar correo
const formVerificacionCodigo = document.getElementById("formVerificacionCodigo")
//envio los datos al servidor para el registro
const formContainer = document.getElementById("formContainer");
formContainer.classList.add("seccionFlex")

botonEnviar.addEventListener("click", () => {
    if(botonEnviar.textContent == "Registarse"){
        registrarse()
    }else{
        verificarCodigo()
    }
    
});


const registrarse = async()=>{
    //hago visible el contenedor de imprimir mensaje
    imprimirMen.style.display = 'block'
    imprimirMen.style.color = 'var(--color-cuatro)'

    const userContraseña = document.getElementById("userContraseña").value;
    const userConfiContraseña = document.getElementById("userConfiContraseña").value;
    const checkbox = document.getElementById("aceptarTerminos");
    if (userContraseña === userConfiContraseña) {
        if (checkbox.checked) {

            //muestro el progres bar
            mostrarProgressBar(botonEnviar)

            const correo = document.getElementById("userEmail").value
            //imprimo el correo en el form de verificar codigo
            document.querySelector(".imprimirCorreo").textContent = correo

            var formDataObject = {};
            const formData = new FormData(formContainer);
            formData.forEach(function (value, key) {
                formDataObject[key] = value;
            });

            var jsonData = JSON.stringify(formDataObject);
            
            try {
                const response = await fetch('/registrar.html', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: jsonData
                });
                const data = await response.json(); // Espera a que se resuelva la promesa y convierte la respuesta en JSON

                //imprimo el mensaje
                imprimirMen.textContent = data.mensaje

                if (response.ok) {
                    /* if (data != undefined) window.location.href = `/${data.data}/`; */
                    formContainer.classList.remove("seccionFlex")
                    formVerificacionCodigo.classList.add("seccionFlex")
                    botonEnviar.textContent = "Verificar"
                    imprimirMen.textContent = ""
                    ocultarProgressBar(botonEnviar)
                    return;
                }else{
                    ocultarProgressBar(botonEnviar)
                    if(response.status = 409){
                        //si el usuario esta registrado resalto iniciar sesion
                        const enlaceIniSesion = document.querySelector(".bo-iniciar_a")
                        enlaceIniSesion.style.color = 'var(--color-dos)'
                    }
                }
            } catch (error) {
                console.error('Error en la solicitud: ', error);
                ocultarProgressBar(botonEnviar)
                imprimirMen.textContent = 'No se pudo registrar. Por favor, inténtalo de nuevo más tarde.';
                imprimirMen.style.color = "red"
            }
        } else {
            imprimirMen.textContent = "Por favor, acepta los términos y condiciones. "
        }
    } else {
        imprimirMen.textContent = "Las contraseñas no coinciden.";
    }
}

//contenedor que pregunta que si ya se tiene una cuenta
const conTienesUnaCuenta = document.querySelector(".tener-cuenta")


//logica para verificar el codigo
const verificarCodigo = async()=>{
    console.log("verificando")
    //muestro el progres bar
    mostrarProgressBar(botonEnviar)
    const codigo = document.getElementById("inputCodigo").value
    const correo = document.getElementById("userEmail").value
    
    const verificacion = {
        codigo:codigo,
        userEmail: correo
    }
    
    var jsonData = JSON.stringify(verificacion);
    
    try {
        const response = await fetch('/registrar.html/codigo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonData
        });
        const data = await response.json(); // Espera a que se resuelva la promesa y convierte la respuesta en JSON
        console.log(data)
    
        //imprimo el mensaje
        imprimirMen.textContent = data.mensaje
    
        if (response.ok) {
            const protocol = window.location.protocol;
            console.log(protocol);  // Ejemplo: "http:"
            
            // Obtener el nombre del host (incluyendo el puerto)
            const host = window.location.host;
            console.log(host);  // Ejemplo: "localhost:8020"
        
            const panelURL = `${protocol}//${host}/panel.html/${data.data}`
        console.log(panelURL)
        
            setTimeout(()=>{window.location.href = panelURL},1000)
            ocultarProgressBar(botonEnviar)
        }else{
            imprimirMen.textContent = data.mensaje
            ocultarProgressBar(botonEnviar)
        }
    } catch (error) {
        console.error('Error en la solicitud: ', error);
        ocultarProgressBar(botonEnviar)
        imprimirMen.textContent = 'No se pudo verificar. Por favor, inténtalo de nuevo más tarde.';
        imprimirMen.style.color = "red"
    }
} 


/* //verifica si el usuario esta creado sino lo crea
const verificarUser = (correo,callback)=>{
    //valido si el usuario ya se encuentra en la base de datos
    const sql = 'SELECT COUNT(*) AS count FROM usuarios WHERE correo = ?';
    conexion.query(sql,[correo],(err,result)=>{
        if(err){
            callback(err,null)
            console.err("error en la consulta")
        }else{
            const filasCount = result[0].count;
            if(filasCount > 0){
                console.log("el usuario se encuentra registrado")
                callback(null,true);
            }
            else{
                console.log("verificacion de registro: el usuario no se encuentra registrado")
                callback(null,false);
            }
        }
    })
}

//registro de usuarios
regisUsers.post('/registrar.html',(req,res)=>{
    const {userEmail,userNombre,userContraseña,aceptarTerminos,userTelefono} = req.body;
    verificarUser(userEmail,(err,userRegistrado)=>{
        console.log("entro")
        if(err)console.error("error al verificar el usuario")
        else{
            if(userRegistrado){
                console.log("el usuario se encuentra registrado")
                res.status(409).json({mensaje: "el usuario se encuentra registrado"})
            }
            else{
                console.log("el usuario no se encuentra registrado")
                 //id unico para crear las carpetas de usuarios
                const idenUnico = generadorIdsUnicos(userEmail)
                const rutaCarpeta = path.join(__dirname,'usuarios',idenUnico);
                // const rutaLogo = path.join(__dirname,`usuarios/${idenUnico}`,"logo") 
                 //valido si la carpeta ya existe
                 if(!fs.existsSync(rutaCarpeta)){
                    fs.mkdirSync(rutaCarpeta);
                    // fs.mkdirSync(rutaLogo) 
                    console.log(`la carpeta para el ${userEmail} se ha creado correctamente como ${idenUnico}`)
                }
                else{
                    console.log(`la carpeta para el usuario ${userEmail} ya existe como ${idenUnico}`)
                }

             //inserto los datos del formulario a la base de datos
                const sql = "INSERT INTO usuarios(nombre,correo,contraseña,terminos_condiciones,user_telefono,id_unico) VALUES(?,?,?,?,?,?)"
                conexion.query(sql,[userNombre,userEmail,userContraseña,aceptarTerminos,userTelefono,idenUnico],(err,result)=>{
                    if(err){
                        res.status(500).send("No se agregaron correctamente los datos, vuelva a intentarlo");
                        console.log(err);throw err;
                    }
                    else{
                        console.log(result.affectedRows)
                        if(result.affectedRows == 1){
                            res.status(201).json({mensaje: "usuario registrado correctamente",data:idenUnico})
                        }   
                    }
                })
            }
        }
    })
    
    console.log(userEmail,userNombre,userContraseña,aceptarTerminos,userTelefono)
}); */