
//logica para cerrar sesion
const botonCerrarSesion =document.querySelectorAll(".bo-CerraSe")
botonCerrarSesion.forEach(boton=>{
    boton.addEventListener("click",function(){
        const cerrarSesion = ()=>{
            fetch('/panel.html/cerrar')
        .then(response=>{
            if(!response.ok){
                console.error("Error al intentar cerrar sesion: ",response.status)
            }
            else console.log("sesion cerrada con exito");
            const host = window.location.host;
            window.location.href = `http://${host}/cuenta/login.html`
        })
        .catch(err=>{
            console.error("Error en la solicitud y al cerrar sesion: ",err)
            cerrarSesion()
        })
        }
        cerrarSesion()
    })
})

const llamarNegocios = () =>{
    const inputHidden = document.getElementById("id_unico").value;
    const id_unico = new URLSearchParams(inputHidden).toString().replace('=', ''); // Eliminar el signo de igual

    fetch(`/panel.html/negocios/obtener?id_unico=${id_unico}`)
    .then(response =>{
        if(!response.ok){
            //contenedor de imprimir mensaje de error
            const imprimirMen_obtener = document.querySelector(".imprimirMen_obtener")
            imprimirMen_obtener.style.display = "block"
            imprimirMen_obtener.textContent = "Ocurrio un error al obtener los negocios. Intentalo mas tarde"
            
            console.error("error  al obtener los negocios",response.status)
        }
        return response.json()        
    })
    .then(data =>{
        //console.log(data)
        //contenedor de crear negocios
        const crearNegocioContainer = document.getElementById("crearNegocioContainer")
            //contenedor de los negocios
        const containerNegocios = crearNegocioContainer.parentNode;
            //contenedor para renderizar correctamente
        const fragmento = document.createDocumentFragment();
        data.forEach(negocio => {
            // Crear el elemento <article> y asignarle la clase "negocio-container"
            const article = document.createElement('article');
            article.classList.add('negocio-container');

            // Crear el encabezado del artículo
            const header = document.createElement('header');
            header.classList.add('negocio-container_header');

            // Crear el título del encabezado y asignarle la clase "negocio-header_titulo"
            const h2 = document.createElement('h2');
            h2.classList.add('negocio-header_titulo');
            const nombreConEspacios = negocio.nombre.replace(/_/g, ' ');
            h2.textContent = nombreConEspacios;

            // Agregar el título y la imagen al encabezado
            header.appendChild(h2);

            // Crear la imagen del encabezado y asignarle la clase "negocio-header_logo"
            //verifico si hay imagen
            if(negocio.logo){
                const img = document.createElement('img');
                img.setAttribute('src', `../../${id_unico}/${negocio.logo}`);
                img.setAttribute('alt', `${negocio.descripcion}`);
                img.classList.add('negocio-header_logo');
                img.loading = "lazy";

                // Agregar el título y la imagen al encabezado
                header.appendChild(img);
            }
            
            
            // Crear el contenido principal del artículo
            const main = document.createElement('main');
            main.classList.add('negocio-container_main');

            // Crear el párrafo del contenido principal y asignarle la clase "negocio-container_parrafo"
            const p = document.createElement('p');
            p.classList.add('negocio-container_parrafo');
            p.textContent = negocio.descripcion;
            // Limitar el texto del párrafo y agregar puntos suspensivos al final si es necesario
            const limitarTexto = (elemento, limite) => {
                const texto = elemento.textContent;
                if (texto.length > limite) {
                    elemento.textContent = texto.substring(0, limite) + '...';
                }
            };
            const limiteCaracteres = 30; // ajusta el límite según tu preferencia
            limitarTexto(p, limiteCaracteres);

            // Agregar el párrafo al contenido principal
            main.appendChild(p);

            // Crear el pie de página del artículo
            const footer = document.createElement('footer');
            footer.classList.add('negocio-container_footer');

            // Crear los botones del pie de página y asignarles las clases correspondientes
            const borrarBtn = document.createElement('button');
            borrarBtn.classList.add('negocio-footer_boton', 'boton_borrar','boton');
            borrarBtn.setAttribute("data-id",negocio.id)
            borrarBtn.setAttribute("data-nombre",negocio.nombre)
            borrarBtn.textContent = 'Borrar';
            borrarBtn.style.backgroundColor = "red";
            //agrego el eventoalboton
            borrarBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const negocio_id = e.target.getAttribute("data-id");
                const negocioNombre = e.target.getAttribute("data-nombre"); 
                console.log("ID del negocio: ", negocio_id);
                console.log("Nombre del negocio:", negocioNombre);
                const id_unico_dueno = document.getElementById("id_unico").value;
            
                const preguntaBorrarOpcion = document.querySelector(".preguntaBorrarOpcion");
                preguntaBorrarOpcion.textContent = "¿Seguro que desea eliminar el negocio? Se borrará junto a todos sus productos";
            
                // Oculto el botón de cancelar plan 
                const btnPreguntaCanSubs = document.querySelector(".pregunta_cancelarSubs");
                btnPreguntaCanSubs.style.display = "none";
            
                // Llamo al botón en panel.js
                const btnPreguntaBorrar = document.querySelector(".pregunta_aceptar");
                btnPreguntaBorrar.style.display = "block";
            
                // Remuevo cualquier listener previo para evitar múltiples ejecuciones
                btnPreguntaBorrar.replaceWith(btnPreguntaBorrar.cloneNode(true));
                const newBtnPreguntaBorrar = document.querySelector(".pregunta_aceptar");
                newBtnPreguntaBorrar.addEventListener("click", function handleBorrarNegocio() {
                    // Llamar a la función de eliminación con los parámetros actuales
                    borrarNegocio(id_unico_dueno, negocioNombre, negocio_id);
                    console.log("Negocio eliminado:", negocio_id);
            
                    // Reiniciar los parámetros después de la eliminación
                    preguntaBorrarOpcion.textContent = "";
                    newBtnPreguntaBorrar.style.display = "none";
                });
            
                // Muestro la pregunta de eliminación
                mostrarPreguntaEliminacion();
            });
            
            const verNegocioBtn = document.createElement('button');
            verNegocioBtn.classList.add('negocio-footer_boton', 'boton_verNegocio','boton');
            verNegocioBtn.setAttribute("data-id",negocio.id)
            verNegocioBtn.setAttribute("data-nombre",negocio.nombre)
            verNegocioBtn.textContent = 'Administrar';
            //agrego el evento al boton de ver neocio
            verNegocioBtn.addEventListener("click",(e)=>{
                // Obtener el valor del atributo 'data-id' del botón
                const negocio_id = e.target.getAttribute("data-id");
                
                //obtengo el id_unico del negocio
                const id_unico_dueno = document.getElementById("id_unico").value;
                setTimeout(window.location.href = `/${id_unico_dueno}?id=${negocio_id}`,1000)
            })

            // Agregar los botones al pie de página
            footer.appendChild(borrarBtn);
            footer.appendChild(verNegocioBtn);

            // Agregar el encabezado, el contenido principal y el pie de página al artículo
            article.appendChild(header);
            article.appendChild(main);
            article.appendChild(footer);
            fragmento.appendChild(article)

            // Agregar el artículo generado al contenedor de negocios
            containerNegocios.insertBefore(fragmento,crearNegocioContainer);

        });
        ocultarProgressBar("#containerNegocios","#progessBar-container_obtener","grid")
    })
    .catch(err =>{
        console.error("error en la solicitud:" ,err)
    })
}

//logica de crear negocios
const logicaCrearNegocio = () => {
    const formContainer = document.getElementById("formContainer");
    const negocioNombre = document.getElementById("negocioNombre");
    const noNombre = negocioNombre.value.trim();
    const id_unico = document.getElementById("id_unico").value;
    const inputLogo = document.getElementById("negocioLogo")
    const file = inputLogo.files[0];


    if (noNombre === "") {
        console.error("El negocio no tiene nombre");
        const inputNegocioNombre = document.getElementById("negocioNombre");
        inputNegocioNombre.style.border = "2px solid red";
        inputNegocioNombre.addEventListener("change", () => {
            inputNegocioNombre.style.border = "1px solid var(--color-uno)";
        });
        retrocederFormulario();
        mostrarModalMensajes("El negocio no tiene nombre");
    } else if (!file) {
        console.error("El negocio no tiene logo");
        document.querySelector(".archivo_label").style.border = "2px solid red";
        retrocederFormulario();
        mostrarModalMensajes("El negocio no tiene logo");
    }else {
        //oculto el boton de anterior del formulario 
        botonAnterior.style.display = "none"

        mostrarProgressBar(".boton_enviar", "#progessBar-container_crearNegocio");
        const formData = new FormData(formContainer);
        console.log(formData);

        const crearNegocio = () => {
            fetch(`/${id_unico}/panel.html/agregar`, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                botonAnterior.style.display = "block"
                volverInicioFormulario()
                ocultarProgressBar(".boton_enviar", "#progessBar-container_crearNegocio", "block");
                if (response.status === 403) {
                    mostrarModalMensajes("El usuario alcanzó el máximo de negocios permitidos");
                    ocultarFormulario();
                } else {
                    if (!response.ok) {
                        mostrarModalMensajes("El negocio no se creó correctamente")
                        console.error(`Error al registrarse, estado: ${response.status}`);
                        return;
                    } else {
                        console.log(response.status, "el negocio se creó con éxito");
                        const containerNegocios = document.getElementById("containerNegocios");
                        containerNegocios.innerHTML = " ";
                        ocultarFormulario();
                        funcionesSinRecargarPagina();
                        return response.json();
                    }
                }
            })
            .catch(err => {
                botonAnterior.style.display = "block"
                mostrarModalMensajes("Error al crear el negocio");
                volverInicioFormulario()
                console.error('Error en la solicitud: ', err);
            });
        };
        crearNegocio();
    }
};

const botonEnviar = document.querySelector(".boton_enviar");
botonEnviar.addEventListener("click", () => {
    if (botonEnviar.textContent === "Siguiente") {
        avanzarFormulario();
    } else if (botonEnviar.textContent === "Crear Negocio") {
        logicaCrearNegocio();
    }
});

//contendor de crear negocio
const conCrearNegocio = ()=>{
    const containerNegocios = document.getElementById("containerNegocios")

    const article = document.createElement("article")
    article.classList.add("negocio-container")
    article.id = "crearNegocioContainer"

    const header = document.createElement("header")
    header.classList.add("negocio-container_header")

    const h2 = document.createElement("h2")
    h2.classList.add("negocio-header_titulo")
    h2.textContent = "Bysite.pro"

    const img = document.createElement("img")
    img.classList.add("negocio-header_logo")
    img.src = "../../img/logo.jpeg"
    img.alt = "Logo de Byson"

    const footer = document.createElement("footer")
    footer.classList.add("negocio-container_footer")

    const button = document.createElement("button")
    button.classList.add("negocio-footer_boton","boton_negocio",'boton')
    button.textContent = "Crear Negocio"

    containerNegocios.appendChild(article)
    article.appendChild(header)
    article.appendChild(footer)
    header.appendChild(h2)
    header.appendChild(img)
    footer.appendChild(button)
}


//logica para eliminar los negocios
//logica de confirmacion para eliminar negocio
//obtengo el contenedor del formulario
const preguntaContainer = document.querySelector(".main-pregunta_container")
//footer de la pagina
const suscribirseContainer = document.querySelector(".suscribirse-container")
// Función para mostrar y confirmacion de eliminar
const mostrarPreguntaEliminacion = () => {
    preguntaContainer.classList.add("mostrarPregunta");
    document.body.classList.add("no-scroll");
    preguntaContainer.scrollIntoView();
    //footer
    suscribirseContainer.style.display = "none"
};

// Función para ocultar el formulario
const ocultarPreguntaEliminacion = () => {
    preguntaContainer.classList.remove("mostrarPregunta");
    document.body.classList.remove("no-scroll");
    //oculto el progress bar
    ocultarProgressBar(".pregunta_aceptar","#progessBar-container_eliminar","inline-block")
        //footer
        suscribirseContainer.style.display = "flex"
};

//funcion que elimina el negocio
const borrarNegocio = (id_unico_dueno,negocioNombre,negocio_id)=>{
    //muestro el progress bar
    mostrarProgressBar(".pregunta_aceptar","#progessBar-container_eliminar")
    
    fetch(`/${id_unico_dueno}/${negocioNombre}/${negocio_id}/eliminar`,{
        method: 'DELETE'
    })
    .then(response =>{
        if(!response.ok){
            contenedorMensaje.style.backgroundColor ="#222"
            contenedorMensaje.style.color ="#fff"

            mostrarModalMensajes("Error al eliminar el negocio")
            ocultarPreguntaEliminacion()
            ocultarProgressBar(".pregunta_aceptar","#progessBar-container_eliminar","inline-block")
        }else{
            mostrarModalMensajes("negocio eliminado con exito")
            ocultarPreguntaEliminacion()
            //elimino los datos ya imprimidos
            const containerNegocios = document.getElementById("containerNegocios")
            containerNegocios.innerHTML = " "
            funcionesSinRecargarPagina()
            ocultarProgressBar(".pregunta_aceptar","#progessBar-container_eliminar","inline-block")
        }
    })
    .catch(err=>{
        ocultarPreguntaEliminacion()
        contenedorMensaje.style.backgroundColor ="#222"
        contenedorMensaje.style.color ="#fff"
        mostrarModalMensajes("Error al eliminar el negocio")
    ocultarProgressBar("#progessBar-container_eliminar",".pregunta_aceptar","inline-block")
    console.error("error: " , err)
    })
  }

  //obtengo los negocios al cargar la pagina
window.addEventListener("load",function(){
    //muestro el progressbar
    mostrarProgressBar("#containerNegocios","#progessBar-container_obtener")
    setTimeout(funcionesSinRecargarPagina(),4000)
})

//funcion para agregar los productos, eventos sin recargar la pagina
const funcionesSinRecargarPagina = ()=>{
    conCrearNegocio()
    llamarNegocios()
    const botonNegocio = document.querySelector(".boton_negocio")
    //boton del contendor de crear negocio
    botonNegocio.addEventListener("click",function(){
        const  id_unico = document.getElementById("id_unico").value;
            setTimeout(vericarCanNegocios(id_unico),500);
    })
}

 //logica para verificar si puedo crear un nuevo negocio antes de abrir el formulario
function vericarCanNegocios(id){
// Eliminar el signo de igual
        //verifico que se pueda crear mas negocios antes de abrir el formulario
fetch(`/panel.html/negocios/verificar/${id}`)
.then(response=>{
    if(response.ok){
        mostrarFormulario()
    }
    else{
        mostrarModalMensajes("Maximo de negocios alcanzado, mejora tu suscripcion para crear mas")
        mostrarModalSuscribcion()
    }
    return response.json()
    
}).then(data=>{
    console.log(data.mensaje)
})
.catch(err =>{
    console.error("error al obtener la respuesta: " ,err)
})
}
