//ajustes para el header de la pagna 
const boMenu = document.getElementById("boMenu")
boMenu.addEventListener("click",function(){
    abrirMenu()
});
const boCMenu = document.getElementById("boCMenu")
boCMenu.addEventListener("click",function(){
    cerrarMenu()
});
const menuPhone = document.querySelector(".menu_container")
//funciones para abrir y cerrar el menu
const abrirMenu = ()=>{
    boMenu.style.display = 'none'
    boCMenu.style.display = 'block'
    menuPhone.classList.add("mostrarMenu")
    document.body.style.overflow = 'hidden'
    
};
function cerrarMenu() {
    if (menuPhone.classList.contains("mostrarMenu")) {
        menuPhone.classList.remove("mostrarMenu");
        boMenu.style.display = "block";
        boCMenu.style.display = "none"
    document.body.style.overflow = 'auto'

        
    }
}

// Ocultar menú responsivo al hacer clic en cualquier parte del documento excepto el menú
document.addEventListener("click", function (event) {
    const isClickInside = menuPhone.contains(event.target) || boMenu.contains(event.target);

    if (!isClickInside) {
        cerrarMenu()
    }
});
//cierra el menu si se cambia el tamaño de la pantalla
window.addEventListener("resize", cerrarMenu);


//logica del formulario

const motrarLogoForm = ()=>{
    //evento de si hay cambios para enviar la solicitud
    const negocioLogo = document.getElementById("negocioLogo")
    negocioLogo.addEventListener("change",function(e){
        e.stopPropagation()

        const mostrarImagen_archivo = document.querySelector("#mostrarImagen_archivo")
        const file = this.files[0];
        if(file){
            const reader = new FileReader();
            reader.onload = function(event){
                const label = document.getElementById("negocioLogoLabel")
                const imagenUrl = event.target.result;
                label.innerHTML = `<img src='${imagenUrl}' class="mostrarImagen_archivo">`
                label.style.border = "none"
                label.style.height = "auto"
            }
            reader.readAsDataURL(file)
        }
        else{
            mostrarImagen_archivo.style.backgroundImage = ` `
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    const colorInputs = document.querySelectorAll(".form-input_color");
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


//obtengo el contenedor del formulario
const formulario = document.querySelector(".formulario")
// Función para mostrar el formulario
const mostrarFormulario = () => {
    formulario.classList.add("mostrarFormulario");
    document.body.classList.add("no-scroll");
    formulario.scrollIntoView();
    motrarLogoForm()
};

// Función para ocultar el formulario
const ocultarFormulario = () => {
    formulario.classList.remove("mostrarFormulario");
    document.body.classList.remove("no-scroll");
    //botengo los inputs y les quito el valor al cerrar el formulario
    const inputs = document.querySelectorAll(".form-input")
    inputs.forEach(input=>{
        input.value = ""
    })
};

const avanzarFormulario = () => {
    if (indiceSeccionActual > 0) {
        secciones[indiceSeccionActual - 1].classList.remove("seccionForm");
    }
    secciones[indiceSeccionActual].classList.add("seccionForm");
    indiceSeccionActual++;
    if (indiceSeccionActual >= 0) {
        botonEnviar.classList.add("botonform");
        botonEnviar.textContent = "Siguiente";
        botonAnterior.textContent = "Cancelar";
    }
    if (indiceSeccionActual > 1) {
        botonAnterior.textContent = "Anterior";
    }
    if (indiceSeccionActual >= secciones.length) {
        botonEnviar.textContent = "Crear Negocio";
    }
};

const retrocederFormulario = () => {
    indiceSeccionActual--;
    secciones[indiceSeccionActual - 1].classList.add("seccionForm");
    secciones[indiceSeccionActual].classList.remove("seccionForm");
    if (indiceSeccionActual === 1) {
        botonAnterior.textContent = "Cancelar";
    }
    if (indiceSeccionActual < secciones.length) {
        botonEnviar.textContent = "Siguiente";
    }
};

const volverInicioFormulario = () => {
    retrocederFormulario();
};

var secciones = document.querySelectorAll(".formulario-container_items");
var indiceSeccionActual = 0;

window.addEventListener("load", avanzarFormulario);

const botonAnterior = document.querySelector(".boton_anterior");
botonAnterior.addEventListener("click", ()=>{
    if(botonAnterior.textContent == "Cancelar"){
        ocultarFormulario()
    }else{
        retrocederFormulario()
    }
});

//ajustes para mostrar mensajes generales
const modalMensajes = document.querySelector(".mensajes-modal")
const contenedorMensaje = document.querySelector(".imprimirMenModal")
const mostrarModalMensajes=(mensaje)=>{
    modalMensajes.classList.add("mostrarMensajeModal")
    document.body.classList.add("no-scroll")

    //estilos para el mensaje
    contenedorMensaje.style.backgroundColor = "var(--color-cuatro)"
    contenedorMensaje.style.color ="var(--color-uno)"
    contenedorMensaje.textContent = mensaje
}
const ocultarModalMensajes=()=>{
    modalMensajes.classList.remove("mostrarMensajeModal")
    document.body.classList.remove("no-scroll")
    contenedorMensaje.textContent = " "
}
//boton de ooultar la ventana modal de mensaje
const btn_mensajeModalCerrar = document.querySelector("#btn_mensajeModalCerrar").addEventListener("click",ocultarModalMensajes)


//funcion para mostrar el progress bar
//el parametro es el identidicador de donde voy a remplazar por el progressbar 
const mostrarProgressBar =(contenedor,progresbar)=>{
    document.querySelector(`${progresbar}`).style.display = "block"

    //obtengo el contenedor que voy a ocultar
    document.querySelector(`${contenedor}`).style.display = "none"
}
//funcion para ocultar el progresbar
const ocultarProgressBar =(contenedor,progresbar,display)=>{
    document.querySelector(`${progresbar}`).style.display = "none"

    //obtengo el contenedor que voy a mostrar
    document.querySelector(`${contenedor}`).style.display = display
}

document.addEventListener("DOMContentLoaded", () => {
    obtenerTiposNegocios();
});

const obtenerTiposNegocios = () => {
    fetch('/panel.html/obtener-tipos-negocios')
    .then(response => {
        if (!response.ok) {
            mostrarModalMensajes("No se logró obtener los tipos de negocios");
            throw new Error("No se logró obtener los tipos de negocios");
        }
        return response.json();
    })
    .then(data => {
        const select = document.getElementById('tipoNegocio');
        //console.log(data)
        data.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id;
            option.textContent = tipo.tipo;
            select.appendChild(option);
        });
    })
    .catch(err => {
        mostrarModalMensajes("Error al obtener los tipos de negocios");
        console.error("Error al obtener los tipos de negocios", err);
    });
};
