//logica para ver negocio

/* const verCatalogo = ()=>{
    const negocioNombre = document.getElementById("negocioNombre").value
    const negocio_id = document.getElementById("negocio_id").value
    const host = window.location.host;
    window.open(`http://localhost:8020/negocio/${negocioNombre}/${negocio_id}`,"_blank") 
} */
const verCatalogo = ()=>{
    const subdominio = document.getElementById("negocioDominioInput").value;
    const host = window.location.host;
    console.log("Host completo:", host);
    
    const hostParts = host.split('.');
    if (hostParts.length > 2) {
        // Eliminar el subdominio
        hostParts.shift();
    }
    
    const mainDomain = hostParts.join('.');
    const newUrl = `https://${subdominio}.${mainDomain}`;
    console.log("Nueva URL:", newUrl);
    window.open(newUrl, "_blank");
}

//logica para cambiar los datos del catalogo
// Escuchar si hubo cambio en los inputs y mostrar el botón de guardar
const inputsFormularioCataloto = document.querySelectorAll('.form-input_catalogo');
inputsFormularioCataloto.forEach(input => {
    input.addEventListener('input', function(event) {
        //console.log('Se detectó un cambio en el valor del input:', event.target.value);

        const botonNegocioGuardar = document.querySelector(".form-boton_catalogo");
        if (!botonNegocioGuardar.classList.contains("mostrarBtnGuardarNegocio")) {
            botonNegocioGuardar.classList.add("mostrarBtnGuardarNegocio");

            botonNegocioGuardar.addEventListener("click", function(e) {
                botonNegocioGuardar.classList.remove("mostrarBtnGuardarNegocio");
                setTimeout(() => editarCatalogoInfo(), 300);
            });
        } else {
            //console.log("El botón ya tiene la clase mostrarBtnGuardarNegocio");
        }
    });
});

// Lógica para editar el perfil de usuario
const editarCatalogoInfo = () => {
    mostrarProgressBar();
    // Inputs del negocio
    const inputsFormulario = document.querySelectorAll('.form-input_catalogo');
    const valoresInputs = {};
    inputsFormulario.forEach(input => {
        valoresInputs[input.name] = input.value;
    });
    const valoresJson = JSON.stringify(valoresInputs);
    
    // Llamar a la función de actualizar la info
    verificarSesion(()=>{actualizarCatalogoInfo(valoresJson)});
    ocultarProgressBar();
}


const actualizarCatalogoInfo = (valoresJson) => {
    // Información del negocio
    const id_unico_dueno = document.getElementById("id_unico_dueno").value;
    const negocioNombre = document.getElementById("negocioNombre").value;
    const idNegocios = document.getElementById("negocio_id").value;

    fetch(`/${id_unico_dueno}/${negocioNombre}/${idNegocios}/actualizarCatalogo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: valoresJson
    })
    .then(response => {
        if (!response.ok) {
            console.error("Error al actualizar los datos del catalogo");
            mostrarModalMensajes("Los datos del catalogo no se actualizaron");
        } else {
            obtenerDatosPerfil();
            mostrarModalMensajes("El catalogo se actualizó con éxito");
        }
    })
    .catch(err => {
        console.error("Error:", err);
        contenedorMensaje.textContent = "Error al actualizar el catalogo";
    });
}

//logica para guardar la foto de portada
const negocioFotoPortada = document.querySelector("#catalogo_portadaFoto")
negocioFotoPortada.addEventListener("click",(e)=>{
    editarFotoPortada(e)
})
const editarFotoPortada = (e) => {
    // Mostrar el formulario de actualización de archivo
    mostrarSeccionFormulario(seccionFormularioArchivo);
    // Obtener los datos del producto del botón
    const negocioNombre = e.target.getAttribute("data-nombre");
    const foto = e.target.getAttribute("data-fotoCover");
    const negocioID = e.target.getAttribute("data-id");
    console.log(negocioNombre,foto,negocioID)
    
    //imprimo la foto actual en el input
    const label = document.getElementById('actualizarLabel_label')
    if(foto != 'null'){
        label.innerHTML = `<img src='${foto}' class="mostrarImagen_archivo" alt='3'>`;
    }else{
        noHayImagen()
    }
    verificarSesion(()=>{actualizarArchivo(actualizarNegocioFoto,negocioID,"catalogoFoto","catalogo_portadaFoto")})
};

// Obtener referencia al botón de borrar foto de portada
const btnBorrarfotoCover = document.getElementById("btnBorrarfotoCover");

// Añadir el evento click al botón
btnBorrarfotoCover.addEventListener("click", () => {
    const id_unico_dueno = document.getElementById("id_unico_dueno").value;
    const negocioNombre = document.getElementById("negocioNombre").value;
    const idNegocios = document.getElementById("negocio_id").value;
    // Construir la URL de la solicitud DELETE
    const url = `/${id_unico_dueno}/${negocioNombre}/${idNegocios}/borrarFotoPortada`;

    // Enviar la solicitud DELETE al servidor
    fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
        if (!response.ok) {
            console.error("Error al eliminar la foto de portada");
            mostrarModalMensajes("No se pudo eliminar la foto de portada");
        } else {
            const fotoPortadaCover = document.getElementById("catalogo_portadaFoto")
            fotoPortadaCover.src =  "../../../img/añadir.png"
            document.getElementById("btnBorrarfotoCover").style.display = "none"
            mostrarModalMensajes("La foto de portada se eliminó con éxito");
        }
    })
    .catch(err => {
        console.error("Error:", err);
        mostrarModalMensajes("Error al eliminar la foto de portada");
    });
});

