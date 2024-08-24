
//logica para ir a la pagina de catalogo
const botonCambiarPagina = document.querySelectorAll(".cambiarSeccion",)
botonCambiarPagina.forEach(boton=>{
    boton.addEventListener("click",function(){

        if(boton.textContent == "Catálogo"){
            mostrarCatalogo()
            boton.textContent = "Inicio"
        }else{
            ocultarCatalogo()
            boton.textContent = "Catálogo"
        }
    })
})

//logica para cambiar de seccion de pagina
const paginaVenta = document.getElementById("pagina_venta")
paginaVenta.classList.add("ocultarPagina")
const paginaCatalogo = document.getElementById("pagina_catalogo")
paginaCatalogo.classList.add("ocultarPagina")
const mostrarCatalogo = ()=>{
    paginaVenta.classList.remove("mostrarPagina")
    paginaCatalogo.classList.add("mostrarPagina")

    const irCatalogo =document.querySelector(".irCatalogo")
    irCatalogo.textContent = "Inicio"
}
const ocultarCatalogo = ()=>{
    paginaVenta.classList.add("mostrarPagina")
    paginaCatalogo.classList.remove("mostrarPagina")
}
ocultarCatalogo()

//logica para ir al footer
const nav_contacto = document.querySelector(".nav_contacto").addEventListener("click",()=>{
    const seccionContacto = document.querySelector(`.seccion-contacto`).scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
})

//logica para abrir y cerrar la ventana modal de producto o producto focus
const mostrarVentanaProductoFocus =()=>{
    // Mostrar la ventana modal
    const modalOverlay = document.querySelector(".modal-overlay");
    modalOverlay.classList.add("mostrarOvelayModal")

    const categoriaNav = document.querySelector(".main-nav")
    categoriaNav.style.display = "none"

    document.body.classList.add("no-scroll");
}

//evento que cierra el focus del producto
const cerrarVentanaProductoFocus = ()=>{
   const categoriaNav = document.querySelector(".main-nav")
   categoriaNav.style.display = "flex"

   const modalOverlay = document.querySelector(".modal-overlay");
   modalOverlay.classList.remove("mostrarOvelayModal")

   document.body.classList.remove("no-scroll");

}
document.querySelector(".botonCerrarFocusProductos").addEventListener("click",cerrarVentanaProductoFocus)

//funcion para la cabecera del catalogo para que haga scroll infinito
window.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav-categorias');

    // Copia los elementos de la cabecera y los agrega al final para crear un bucle infinito
    nav.innerHTML += nav.innerHTML;

    // Función para verificar y ajustar el desplazamiento al final
    function checkScroll() {
        if (nav.scrollLeft >= nav.scrollWidth / 2) {
            nav.scrollLeft = 0;
        }
    }

/*     // Verificar el desplazamiento al hacer scroll
    nav.addEventListener('scroll', checkScroll); */
});

/* //logica para hacer scroll en la cabecra de el catalogo con deslizamiento
let touchStartX = 0;
let touchEndX = 0;

// Escuchar eventos táctiles
document.querySelector('.nav-categorias').addEventListener('touchstart', handleTouchStart, false);
document.querySelector('.nav-categorias').addEventListener('touchend', handleTouchEnd, false);

// Función para manejar el inicio del toque
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
}

// Función para manejar el final del toque
function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].clientX;
    handleSwipe();
}

// Función para manejar el swipe
function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (swipeDistance > 50) {
        // Swipe hacia la derecha
        console.log('Swipe hacia la derecha');
        // Aquí puedes agregar la lógica para desplazarte hacia la derecha
    } else if (swipeDistance < -50) {
        // Swipe hacia la izquierda
        console.log('Swipe hacia la izquierda');
        // Aquí puedes agregar la lógica para desplazarte hacia la izquierda
    }
} */

//logica para el buscador
//contenedor del buscador
const buscadorContainer = document.querySelector(".buscadorContainer")
//boton del buscador
const botonBuscador = document.querySelector(".botonBuscador").addEventListener("click",function(){
    buscadorContainer.classList.toggle("mostrarBuscador")
})
//boton cerrar buscador
document.querySelector(".boton-cerrar_buscador").addEventListener("click",function(){
    buscadorContainer.classList.remove("mostrarBuscador")
})

//contenedor principal de la pagina
const container = document.querySelector(".container")

//obtengo el mainHeader para quitarle el position
const mainHeader = document.querySelector(".main-header")

const mostrarNavLateral=()=>{
    const mainNavLateral = document.querySelector(".main-nav_lateral")
    mainNavLateral.classList.add("mostraMain-nav_lateral")
    //oculto el header de categoria
    const categoriaNav = document.querySelector(".main-nav")
    categoriaNav.style.display = "none"
    container.classList.add("no-scroll");

    mainHeader.style.position = "static"

    ocultarElemento("cabecera")
}

const ocultarNavLateral=()=>{
    const mainNavLateral = document.querySelector(".main-nav_lateral")
    mainNavLateral.classList.remove("mostraMain-nav_lateral")
    //muestro el header de categoria
    const categoriaNav = document.querySelector(".main-nav")
    categoriaNav.style.display = "flex"
     //devulvo el scoll al body
     container.classList.remove("no-scroll");

    mainHeader.style.position = "sticky"
    mostrarElemento("cabecera","flex")
}

const ocultarElemento =(clase)=>{
    document.querySelector(`.${clase}`).style.display = "none"
}
const mostrarElemento =(clase,display)=>{
    document.querySelector(`.${clase}`).style.display = display
}

//el parametro es el identidicador de donde voy a remplazar por el progressbar 
const mostrarProgressBar =(progresbar)=>{
    document.querySelector(`${progresbar}`).style.display = "block"
    document.body.classList.add("noScrol")
}
//funcion para ocultar el progresbar
const ocultarProgressBar =(progresbar,)=>{
    document.querySelector(`${progresbar}`).style.display = "none"
    document.body.classList.remove("noScrol")

}

//ajustes para mostrar mensajes generales
const modalMensajes = document.querySelector(".mensajes-modal")
const contenedorMensaje = document.querySelector(".imprimirMenModal")
const mostrarModalMensajes=()=>{
    modalMensajes.classList.add("mostrarMensajeModal")
    document.body.classList.add("no-scroll")

    //estilos para el mensaje
    contenedorMensaje.style.backgroundColor = "var(--color-cuatro)"
    contenedorMensaje.style.color ="var(--color-uno)"
}
const ocultarModalMensajes=()=>{
    modalMensajes.classList.remove("mostrarMensajeModal")
    document.body.classList.remove("no-scroll")

}
//boton de ooultar la ventana modal de mensaje
const btn_mensajeModalCerrar = document.querySelector("#btn_mensajeModalCerrar").addEventListener("click",ocultarModalMensajes)

