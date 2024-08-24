//funcion para mostrar el progress bar

//el parametro es el identidicador de donde voy a remplazar por el progressbar 
const mostrarProgressBar =()=>{
    document.querySelector(`.progessBar-container`).style.display = "block"
    console.log("se mostro")
}
//funcion para ocultar el progresbar
const ocultarProgressBar =()=>{
    document.querySelector(`.progessBar-container`).style.display = "none"
}

// Función para verificar la sesión y ejecutar una función callback si la sesión es válida
const verificarSesion = async (funcion,...arg) => {
    try {
        const response = await fetch('/panel.html/verificar-sesion'); // Agrega await aquí

        if (response.status === 403) {
            mostrarModalMensajes("La sesión caducó, vuelve a iniciar sesión");
            return; // Termina la ejecución si la sesión no es válida
        } else {
            return await funcion(arg); // Llama a la función callback
        }
    } catch (error) {
        mostrarModalMensajes("La sesión caducó, vuelve a iniciar sesión");
        console.error("Error al verificar la sesión", error);
        location.reload();
        return null; // O cualquier valor adecuado para indicar un error
    }
}


const cerrarSesion = ()=>{
    mostrarProgressBar()
    fetch('/panel.html/cerrar')
.then(response=>{
    if(!response.ok){
        console.error("Error al intentar cerrar sesion: ",response.status)
        mostrarModalMensajes("nose pudo cerrar sesion")
    }
    else{
        console.log("sesion cerrada con exito");
        const host = window.location.host;
        window.location.href = `http://${host}/cuenta/login.html`
    }
})
.catch(err=>{
    console.error("Error en la solicitud y al cerrar sesion: ",err)
    /* cerrarSesion() */
    mostrarModalMensajes("Error al cerrar sesion")

})
ocultarProgressBar()
}

//logica para cerrar sesion
const botonCerrarSesion =document.querySelector(".bo-CerraSe")
botonCerrarSesion.addEventListener("click",function(){
         cerrarSesion()
})

//logica para mostrar el perfil en pantallas pequeñas
//obtengo el contendor del perfil
const seccionNegocio = document.querySelector(".seccion_negocio")
//obtengo el contendor de catalogo
const seccionCatalogo = document.querySelector(".seccion_catalogo")


const llamarPerfilNegocio = async () => {
    const id_unico_dueno = document.getElementById("id_unico_dueno").value;
    const negocioNombre = document.getElementById("negocioNombre").value;
    const idNegocios = document.getElementById("negocio_id").value;
    try {
        const response = await fetch(`/${id_unico_dueno}/${negocioNombre}/datos?id=${idNegocios}`);
        if (!response.ok) {
            console.log("los datos del perfil no se cargaron correctamente", response.status)
            contenedorMensaje.textContent = "los datos del perfil no se cargaron correctamente"
            throw new Error(`Error en la respuesta: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al cargar los datos del negocio:", error);
        throw error; // Propaga el error para que se maneje en el contexto de llamada
    }
};

const imprimirDatosNegocio = (data)=>{
    data.forEach(datos=>{
        //agrego la imagen del negocio al header del contenedor
            const headerLogo = document.querySelector(".negocio-header_logo");
            let imgRuta = datos.logo
            headerLogo.src = (imgRuta ? imgRuta: "../../../img/añadir.png");
            headerLogo.loading = "lazy";
            headerLogo.alt = datos.descripcion;
            //ajustes para poder actualizar el logo
            headerLogo.setAttribute("data-nombre",datos.nombre);
            headerLogo.setAttribute("data-logo",datos.logo);
            headerLogo.setAttribute("data-id",datos.id);

        //agrego el nombre del negocio
            const negocioNombre = document.querySelector("#negocioNombreInput")
            negocioNombre.value = datos.nombre.replace(/_/g, ' ');

        //imprimo el nombre en las estadisticas
        document.getElementById("negocioNombre_estadisticas").textContent = datos.nombre.replace(/_/g, ' ');

        //actualizo el nombre del negocio en el input escondido
            const nomNegocioInputHidden = document.getElementById("negocioNombre")
            nomNegocioInputHidden.value = datos.nombre
            
        //agrego la descripcion del negocio
            const negocioDesc = document.querySelector("#negocioDescInput")
            negocioDesc.value = datos.descripcion;
            
       //imprimo el link del negocio
        const negocioDominioInput = document.querySelector("#negocioDominioInput")
        if(datos.subDominio == null){
            negocioDominioInput.value = `link${datos.nombre.replace(/\s+/g, '-')}-${datos.id}`
            mostrarModalMensajes("Edita el negocio y genera un link")
        }else{
            negocioDominioInput.value = datos.subDominio;
            //boton de ir a tienda
            const tienda = document.getElementById("tienda").addEventListener("click",verCatalogo)
        }
            //agrego el correo
            const negocioCorreo = document.querySelector("#negocioCorreoInput")
            negocioCorreo.value = datos.correo

            //imprimo las redes sociales
            const redesSociales ={
                Instagram:datos.instagram,
                WhatsApp:datos.whatsapp,
                Facebook:datos.facebook,
                Tiktok: datos.tiktok,
                Youtube:datos.youtube
            }
            console.log(redesSociales)
            for (const [key, value] of Object.entries(redesSociales)) {
                const elements = document.querySelectorAll(`#negocio${key}Input`);
                elements.forEach(element => {
                    if(value){
                        element.value = value
                    }
                });
            }

        //seccion de catalogo
        //seccion cover
        const tituloPortada = document.getElementById("negocioTituloInput").value = datos.titulo_cover
        const fotoPortadaCover = document.getElementById("catalogo_portadaFoto")
        fotoPortadaCover.src =  (datos.fondo_cover ? datos.fondo_cover : "../../../img/añadir.png")
        //si no existe oculto el boton de borrar foto
        if( datos.fondo_cover == null){
            document.getElementById("btnBorrarfotoCover").style.display = "none"
        }else{
            document.getElementById("btnBorrarfotoCover").style.display = "block"
        }
        fotoPortadaCover.loading = "lazy";
        //ajustes para poder actualizar el logo
        fotoPortadaCover.setAttribute("data-nombre",datos.nombre);
        fotoPortadaCover.setAttribute("data-fotoCover",datos.fondo_cover);
        fotoPortadaCover.setAttribute("data-id",datos.id);

        //color de fondo
        const colorFondo = document.querySelector("#colorFondoInput")
        colorFondo.value = datos.color_fondo
        const hexColorFondoInput = document.getElementById("hexColorFondoInput")
        hexColorFondoInput.value = datos.color_fondo

    //agrego el color uno del negocio
        const colorUno = document.querySelector("#colorUnoInput")
        colorUno.value = datos.color_uno
        const hexColorUnoInput = document.getElementById("hexColorUnoInput")
        hexColorUnoInput.value = datos.color_uno

    //agrego el color el dos
        const colorDos = document.querySelector("#colorDosInput")
        colorDos.value = datos.color_dos
        const hexColorDosInput = document.getElementById("hexColorDosInput")
        hexColorDosInput.value = datos.color_dos

    //tipografia sellecionada
        negocioFuenteSelect.value = datos.tipografia

            
        //obtengo el boton de guardar los ajustes del perfil y le agrego un dataset del nombre actula del negocio
        const formBotonNegocio = document.querySelector(".form-boton_negocio")
        formBotonNegocio.setAttribute("data-nombre", datos.nombre)
        formBotonNegocio.setAttribute("data-id", datos.id)

        //obtengo el boton de guardar los ajustes del catalogo y le agrego un dataset del nombre actula del negocio
        const formBotonCatalogo = document.querySelector(".form-boton_catalogo")
        formBotonCatalogo.setAttribute("data-nombre", datos.nombre)
        formBotonCatalogo.setAttribute("data-id", datos.id)

        //imprimo el logo y el nombre del negocio en el header del inventario
        const inventarioPerfil__logo = document.querySelector(".inventario-perfil__logo")
        inventarioPerfil__logo.src = (imgRuta ? imgRuta : "../../../img/añadir.png")

        const inventarioPerfil__nombre = document.querySelector(".inventario-perfil__nombre")
        inventarioPerfil__nombre.textContent = datos.nombre.replace(/_/g, ' ');
    })
}
const obtenerDatosPerfil = async ()=>{
    try {
        mostrarProgressBar()
        const datosPerfil = await verificarSesion(llamarPerfilNegocio)
        imprimirDatosNegocio(datosPerfil)
        } catch (error) {
            console.error("Error al cargar los datos del negocio:", error);
            mostrarModalMensajes("Error al cargar los datos del negocio")

        }    
        ocultarProgressBar()
}
//obtengo los datos del perfil al cargar la pagina
window.addEventListener("load",obtenerDatosPerfil);

//logica para ajustes del form del negocio
//ajustes para el textarea
 const textarea = document.getElementById("negocioDescInput");

textarea.addEventListener("input", function() {
    // Ajustar la altura del textarea según su contenido
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";

    // Limitar la altura máxima a 500px
    if (parseInt(this.style.height) > 500) {
        this.style.height = "200px";
        this.style.overflowY = "auto";
    } else {
        this.style.overflowY = "hidden";
    }
});


//logica para actualizar el negocio
// Escuchar si hubo cambio en los inputs y mostrar el botón de guardar
const inputsFormulario = document.querySelectorAll('.form-input_negocio');
inputsFormulario.forEach(input => {
    input.addEventListener('input', function(event) {
        //console.log('Se detectó un cambio en el valor del input:', event.target.value);

        const botonNegocioGuardar = document.querySelector(".form-boton_negocio");
        if (!botonNegocioGuardar.classList.contains("mostrarBtnGuardarNegocio")) {
            botonNegocioGuardar.classList.add("mostrarBtnGuardarNegocio");

            botonNegocioGuardar.addEventListener("click", function(e) {
                botonNegocioGuardar.classList.remove("mostrarBtnGuardarNegocio");
                setTimeout(() => editarNegocioInfo(), 300);
            });
        } else {
            //console.log("El botón ya tiene la clase mostrarBtnGuardarNegocio");
        }
    });
});

// Lógica para editar el perfil de usuario
const editarNegocioInfo = () => {
    mostrarProgressBar();
    // Inputs del negocio
    const inputsFormulario = document.querySelectorAll('.form-input_negocio');
    const valoresInputs = {};
    inputsFormulario.forEach(input => {
        valoresInputs[input.name] = input.value;
    });
    const valoresJson = JSON.stringify(valoresInputs);
    
    // Llamar a la función de actualizar la info
    verificarSesion(()=>{actualizarNegocio(valoresJson)});
    ocultarProgressBar();
}

//logica de editar el subdominio
const negocioDominioInput = document.getElementById("negocioDominioInput")
//boton de guardar subdominio
const btnGuardarSubdominio = document.getElementById("btnGuardarSubdominio")
negocioDominioInput.addEventListener("input", () => {
    let subdominio = negocioDominioInput.value;
    // Reemplazar espacios con guiones
    subdominio = subdominio.replace(/\s+/g, '-');
    negocioDominioInput.value = subdominio;
    
    verificarSubdominio(subdominio);
    btnGuardarSubdominio.style.display = 'block';
});
//boton de copiar el link
copyButton.addEventListener("click", (e) => {
    e.preventDefault()
    const subdominio = negocioDominioInput.value;
    const fullLink = `${subdominio}.bysite.pro`;

    navigator.clipboard.writeText(fullLink)
        .then(() => {
            mostrarModalMensajes("Enlace copiado al portapapeles");
        })
        .catch(err => {
            console.error("Error al copiar el enlace", err);
            mostrarModalMensajes("Error al copiar el enlace, inténtalo más tarde");
        });
});

btnGuardarSubdominio.addEventListener("click",(e)=>{
    e.preventDefault()
    let subdominio = negocioDominioInput.value;
    guardarSubdominio(subdominio)
    console.log("guardado")
})

const guardarSubdominio = async (subdominio) => {
    mostrarProgressBar();
    const id_unico_dueno = document.getElementById("id_unico_dueno").value;
    const idNegocios = document.getElementById("negocio_id").value;
    fetch(`/actualizar-subdominio/${id_unico_dueno}/${idNegocios}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subdominio: subdominio })
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        ocultarProgressBar();
        mostrarModalMensajes(body.mensaje);
        if (status === 200) {
            btnGuardarSubdominio.style.display = 'none';
            const tienda = document.getElementById("tienda").addEventListener("click",verCatalogo)
        }else if(status === 403){
            
        }
    })
    .catch(err => {
        ocultarProgressBar();
        console.error("Error al guardar el link", err);
        mostrarModalMensajes("Error, inténtalo más tarde");
    });
}

const verificarSubdominio = (subdominio) => {
    const idNegocios = document.getElementById("negocio_id").value;
    fetch(`/verificar-subdominio/${idNegocios}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subdominio: subdominio })
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        if (status === 200) {
            negocioDominioInput.classList.remove("subdominioR");
            negocioDominioInput.classList.add("subdominioG");
        } else {
            negocioDominioInput.classList.remove("subdominioG");
            negocioDominioInput.classList.add("subdominioR");
            mostrarModalMensajes(body.mensaje);
        }
    })
    .catch(err => {
        console.error("Error al verificar el subdominio", err);
        mostrarModalMensajes("Error, inténtalo más tarde");
    });
}


const actualizarNegocio = (valoresJson) => {
    // Información del negocio
    const id_unico_dueno = document.getElementById("id_unico_dueno").value;
    const negocioNombre = document.getElementById("negocioNombre").value;
    const idNegocios = document.getElementById("negocio_id").value;

    fetch(`/${id_unico_dueno}/${negocioNombre}/${idNegocios}/actualizarInfo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: valoresJson
    })
    .then(response => {
        if (!response.ok) {
            console.error("Error al actualizar los datos");
            mostrarModalMensajes("Los datos del negocio no se actualizaron");
        } else {
            obtenerDatosPerfil();
            mostrarModalMensajes("El negocio se actualizó con éxito");
        }
    })
    .catch(err => {
        console.error("Error:", err);
        contenedorMensaje.textContent = "Error al actualizar el negocio";
    });
}

//logica para actualizar el logo del negocio
const negocioLogoHeader = document.querySelector(".negocio-header_logo")
negocioLogoHeader.addEventListener("click",(e)=>{
        editarNegocioLogo(e)
})
const editarNegocioLogo = (e) => {
    // Mostrar el formulario de actualización de archivo
    mostrarSeccionFormulario(seccionFormularioArchivo);
    // Obtener los datos del producto del botón
    const negocioNombre = e.target.getAttribute("data-nombre");
    const negocioLogo = e.target.getAttribute("data-logo");
    const negocioID = e.target.getAttribute("data-id");
    console.log(negocioNombre,negocioLogo,negocioID)
    
    //imprimo la foto actual en el input
    const label = document.getElementById('actualizarLabel_label')
    if(negocioLogo != 'null'){
        label.innerHTML = `<img src='${negocioLogo}' class="mostrarImagen_archivo" alt='3'>`;
    }else{
        noHayImagen()
    }
    verificarSesion(()=>{actualizarArchivo(actualizarNegocioFoto,negocioID,"negocioLogo", "negocio-header_logo")})
};


 const actualizarNegocioFoto = (negocioID,ruta,selector)=>{
    mostrarProgressBar();

     const formContainer_archivo = document.getElementById("formContainer_archivo")
     const formData = new FormData(formContainer_archivo);
 
     const id_unico_dueno = document.getElementById("id_unico_dueno").value;
     const negocioNombre = document.getElementById("negocioNombre").value;
     fetch(`/${id_unico_dueno}/${negocioNombre}/${negocioID}/${ruta}`,{
         method: 'PUT',
         body: formData 
     })
     .then(response =>{
         if(!response.ok){
             console.error("La imagen del negocio no se actualizo")
             ocultarProgressBar();
         }
         return response.json()
     })
     .then(data=>{
        mostrarModalMensajes(data.mensaje)
        console.log(data.src)
        cambiarFoto(selector,data.src)
        ocultarProgressBar();
     })
     .catch(err=>{
         console.error("error: " , err)
         contenedorMensaje.textContent = 
         mostrarModalMensajes("Error al actualizar la foto del negocio")
         ocultarProgressBar();
        })
 }
 


