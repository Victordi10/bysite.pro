
//logica de los colores
    document.addEventListener("DOMContentLoaded", () => {
        const colorInputs = document.querySelectorAll(".input-negocio_color");
        const hexInputs = document.querySelectorAll(".form-input_hex");
    
        colorInputs.forEach((colorInput, index) => {
            const hexInput = hexInputs[index];
            
            // Inicializar campo de texto con valor inicial del selector de color
            hexInput.value = colorInput.value;
            
            // Actualizar campo de texto cuando cambia el selector de color
            colorInput.addEventListener("input", () => {
                hexInput.value = colorInput.value;
            });
    
            // Actualizar selector de color cuando cambia el campo de texto
            hexInput.addEventListener("input", () => {
                const value = hexInput.value;
                if (/^#[0-9A-F]{6}$/i.test(value)) {
                    colorInput.value = value;
                } else if (value.length >= 3) {
                    // Solo si tiene al menos 3 caracteres, actualiza el selector de color
                    if (/^#[0-9A-F]{0,6}$/i.test(value)) {
                        colorInput.value = `#${value.padEnd(6, '0')}`;
                    }
                }
            });
        });
    });
    
//listo todas las fuentes disponibles
const negocioFuenteSelect = document.getElementById("negocioFuenteSelect")

const llamarTipografias = ()=>{
    const id_unico_dueno = document.getElementById("id_unico_dueno").value;
    fetch(`/panel.html/${id_unico_dueno}/tipografias`)
    .then(response=>{
        if (!response.ok) {
            console.log("Error al cargar las tipografias", response.status)
            setTimeout(()=>{
                contenedorMensaje.textContent = "No se cargaron las tipografias"
            },3000)
            throw new Error(`Error en la respuesta: ${response.status}`);
        }
        return response.json();
    }).then(data=>{
        //console.log(data)
        data.forEach(opcion=>{
            const opciones = document.createElement("option")
            opciones.textContent = opcion.tipografia
            opciones.value = opcion.id
            opciones.style.fontFamily = opcion.font_family
            negocioFuenteSelect.appendChild(opciones)
        })
    })
    .catch(err=>{
        console.error("Error al cargar las tipografias:", err);
        throw err; // Propaga el error para que se maneje en el contexto de llamada
    })
}
llamarTipografias()

//logica para mostrar las secciones de la pagina
//obtengo los botones del header para ir a las secciones
const botonesHeaderSeccion = document.querySelectorAll(".boton-aside_seccion");

botonesHeaderSeccion.forEach(boton => {
    boton.addEventListener("click", (e) => {
        const seccion = e.target.dataset.seccion;

        // Eliminar la clase de resaltado de todos los botones
        botonesHeaderSeccion.forEach(boton => {
            boton.classList.remove("resaltarSeccion");
        });

        // Agregar la clase de resaltado solo al botón actualmente presionado
        boton.classList.add("resaltarSeccion");

        // Ocultar todas las secciones principales
        const mainSeccionContainers = document.querySelectorAll(".main-seccion");
        mainSeccionContainers.forEach(con => {
            con.classList.remove("mostrarSeccion");
        });

        // Mostrar solo la sección correspondiente al botón presionado
        const seccionContainer = document.getElementById(seccion);
        seccionContainer.classList.add("mostrarSeccion");

        ocultarMenuOpciones()
    });
});

const mostrarMenuOpciones = ()=>{
    const menu_opciones = document.querySelector(".menu_opciones")
    menu_opciones.classList.toggle("show")
}
const ocultarMenuOpciones = ()=>{
    const menu_opciones = document.querySelector(".menu_opciones")
    menu_opciones.classList.remove("show")
}
//botones de acciones del menu de opciones
document.getElementById("menu-opciones_btnCerrar").addEventListener("click",ocultarMenuOpciones)
//logica para mostrar el menu de opciones
const btnAsideMenu = document.getElementById("btnAsideMenu").addEventListener("click",mostrarMenuOpciones)

//boton de ir al panel de admins
const btn_panelAdmins = document.getElementById("btn_panelAdmins").addEventListener("click",()=>{
    const host = window.location.host
    const id_unico_dueno = document.getElementById("id_unico_dueno").value;
    window.location.href = `http://${host}/panel.html/${id_unico_dueno}`;
})



window.addEventListener("DOMContentLoaded",()=>{
    const seccionContainer = document.getElementById(`seccion-productos`)
        seccionContainer.classList.add("mostrarSeccion")
})

//ajustes para mostrar mensajes generales
const modalMensajes = document.querySelector(".mensajes-modal")
const contenedorMensaje = document.querySelector(".imprimirMenModal")

//boton de suscribirse de la ventana modal
const btnMenModal = document.getElementById("btnMenModal")
btnMenModal.addEventListener("click",()=>{
    const host = window.location.host
    const id_unico_dueno = document.getElementById("id_unico_dueno").value;
    window.location.href = `http://${host}/panel.html/${id_unico_dueno}`;
})

const mostrarModalMensajes=(texto)=>{
    modalMensajes.classList.add("mostrarMensajeModal")
    document.body.classList.add("no-scroll")
    contenedorMensaje.textContent = texto

    //estilos para el mensaje
    contenedorMensaje.style.backgroundColor = "var(--color-cuatro)"
    contenedorMensaje.style.color ="var(--color-uno)"
}
const ocultarModalMensajes=()=>{
    modalMensajes.classList.remove("mostrarMensajeModal")
    document.body.classList.remove("no-scroll")
    contenedorMensaje.textContent = " "
    btnMenModal.style.display = "none"

}
//boton de ooultar la ventana modal de mensaje
const btn_mensajeModalCerrar = document.querySelector("#btn_mensajeModalCerrar").addEventListener("click",ocultarModalMensajes)

//logica para sus input_redes
const suscripcion = document.getElementById("suscripcion").value
console.log(suscripcion)
if(suscripcion == 1){
    const input_redes = document.querySelectorAll(".input_redes")
    input_redes.forEach(input =>{
        input.addEventListener("click",()=>{
            mostrarModalMensajes("Mas beneficios?")
            btnMenModal.style.display = "inline-block"
        })
    })
    btnMenModal.style.display = "inline-block"
    btnMenModal.textContent = "Suscribete"
    mostrarModalMensajes("Mas beneficios?")
}else if(suscripcion < 4){
    btnMenModal.style.display = "inline-block"
    btnMenModal.textContent = "Mejora tu suscripcion"
    mostrarModalMensajes("Mas beneficios?")
}

//logica depende la suscripcion creo categorias
// Botón para mostrar el formulario de crear categoría
const btnAgregarCategoria = document.getElementById("btnAgregarCategoria");
btnAgregarCategoria.addEventListener("click", () => {
    if(suscripcion == 1){
        btnMenModal.style.display = "inline-block"
        btnMenModal.textContent = "Suscribete"
        mostrarModalMensajes("Mas beneficios?")
    }else{
        const categoriaInput = document.getElementById("categoriaInput");
        // Botón de siguiente del formulario
        const btn_categoriaSiguiente = document.getElementById("btn_categoriaSiguiente");
        // Añadir el evento
        categoriaInput.addEventListener("input", mostrarBotonSiguiente);
        mostrarSeccionFormulario(seccionFormularioCategorias);
    }

});

const cambiarFoto = (idFoto, link, idProducto = 0) => {
    let img = document.querySelector(`#${idFoto}`);
    if (!img) {
        console.error(`Elemento con id ${idFoto} no encontrado.`);
        img = document.querySelector(`#fotoProducto${idProducto}`);
    }

    console.log(`Elemento encontrado:`, img);

    if (img.tagName === "IMG") {
        img.src = link;
        img.dataset.logo = link;
        // img del header de productos
        const  inventarioPerfil__logo = document.querySelector(".inventario-perfil__logo")
        inventarioPerfil__logo.src = link;
    } else {
        img.style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.2)), url("${(link ? link : "../../../img/añadir.png")}")`;
        img.dataset.logo = link;
        const nuevaUrl = link
        const editarElem = document.getElementById(`editar${idProducto}`);
        if (editarElem) {
            editarElem.setAttribute("data-logo", nuevaUrl);
        } else {
            console.error(`Elemento con id editar${idProducto} no encontrado.`);
        }
    }
};
//funcion para cuando no hay imagen en el label de archvo se borra la img
const noHayImagen =()=>{
    const label = document.getElementById('actualizarLabel_label')
    const label2 = document.getElementById('labelArchivoAgregar')
    label.innerHTML = `Añadir imagen`
    label2.innerHTML = `Añadir imagen`
    label.style.border = "1px solid var(--color-dos)"
    label2.style.border = "1px solid var(--color-dos)"
}

//funcion para cada 3 numeros un punto
function formatNumberWithDots(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

const cambiarProductoDetalles = (productoID,nombre,des,precio)=>{
    const nomP = document.getElementById(`productoNom${productoID}`)
    nomP.textContent = nombre
    const desP =document.getElementById(`productoPrecio${productoID}`)
    desP.textContent = precio
    const preP = document.getElementById(`productoDes${productoID}`)
    preP.textContent = des

    //cambio los dataset del boton de editar
    const btnEdi = document.getElementById(`editar${productoID}`)
    btnEdi.dataset.nombre = nombre
    btnEdi.dataset.precio = precio
    btnEdi.dataset.desc = des
}
const btnBuscarNegocios = document.getElementById("btn_seccion-cambiarNegocio").addEventListener("click",async()=>{
    document.querySelector(".negocios-container").innerHTML = " "
    await llamarNegocios()
})
//funcion para imprimir los negocios externos
const llamarNegocios = () =>{
    const id_unico_dueno = document.getElementById("id_unico_dueno").value;

    fetch(`/panel.html/negocios/obtener?id_unico=${id_unico_dueno}`)
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
        console.log(data);
        let negocioEncontrado = false; // Bandera para controlar si se encontró un negocio diferente al ID

        data.forEach(negocio => {
            const negocio_id = document.getElementById("negocio_id").value;

            if (negocio.id !== negocio_id) {
                imprimirNegocios(negocio, id_unico_dueno);
                negocioEncontrado = true; // Se encontró un negocio diferente
            }
        });
        
        // Mostrar mensaje si no se encontró ningún negocio diferente
        if (!negocioEncontrado) {
            const seccion_cambiarNegocio_mensaje = document.querySelector(".seccion_cambiarNegocio-mensaje");
            seccion_cambiarNegocio_mensaje.style.display = "block";
        }

        ocultarProgressBar("#containerNegocios","#progessBar-container_obtener","grid")
    })
    .catch(err =>{
        console.error("error en la solicitud:" ,err)
    })
}

//logica para cambiar de negocios
const imprimirNegocios = (negocio,id_unico_dueno)=>{
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
        img.setAttribute('src', `${negocio.logo}`);
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
    
    const verNegocioBtn = document.createElement('button');
    verNegocioBtn.classList.add('negocio-footer_boton', 'boton_verNegocio','boton');
    verNegocioBtn.setAttribute("data-id",negocio.id)
    verNegocioBtn.setAttribute("data-nombre",negocio.nombre)
    verNegocioBtn.textContent = 'Cambiar negocio';
    //agrego el evento al boton de ver neocio
    verNegocioBtn.addEventListener("click",(e)=>{
        // Obtener el valor del atributo 'data-id' del botón
        const negocio_id = e.target.getAttribute("data-id");
        
        //obtengo el id_unico del negocio
        const host = window.location.host
        setTimeout(window.location.href = `http://${host}/${id_unico_dueno}?id=${negocio_id}`,1000)
    })

    // Agregar los botones al pie de página
    const negocio_id = document.getElementById("negocio_id").value
    if(negocio.id != negocio_id){
        footer.appendChild(verNegocioBtn);
    }

    // Agregar el encabezado, el contenido principal y el pie de página al artículo
    article.appendChild(header);
    article.appendChild(main);
    article.appendChild(footer);

    const cambiarNegocio_container = document.querySelector(".negocios-container ")
    cambiarNegocio_container.appendChild(article)
    // Agregar el artículo generado al contenedor de negocios
}