
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
//logica para cambiar de seccion de pagina
const paginaVenta = document.getElementById("pagina_venta")
paginaVenta.classList.add("ocultarPagina")
const paginaCatalogo = document.getElementById("pagina_catalogo")
paginaCatalogo.classList.add("ocultarPagina")

//cabecera
const cabecera = document.querySelector(".cabecera")
//nav de header principal
const navCabecera = document.querySelector(".nav-container")
// cover 2
const cover2 = document.querySelector(".seccion_cover2")

const cambiarStilosNav =()=>{
    window.addEventListener('scroll', () => {
        const cabeceraRect = cabecera.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const irCatalogo =document.querySelector(".irCatalogo")
        if(irCatalogo.textContent == "Inicio"){
            navCabecera.style.position = "static"
            navCabecera.style.zIndex = "220202"
        }else{
            if(scrollTop > 5){
                navCabecera.style.backgroundColor = "var(--color-fondo)"
                if (scrollTop > cabeceraRect.bottom) {
                    navCabecera.style.position = 'fixed';
                    navCabecera.style.top = '0';
                    navCabecera.style.width = '100%';
                    navCabecera.style.zIndex = "2202021111"
                }
            }else {
                navCabecera.style.position = 'sticky';
                navCabecera.style.top = '0';
                navCabecera.style.backgroundColor = "inherit"
                navCabecera.style.zIndex = "220202"
            }
        }
        
    });
}

const mostrarCatalogo = ()=>{
    paginaVenta.classList.add("ocultarPaginaVenta")
    paginaCatalogo.classList.remove("ocultarPaginaCatalogo")

    const irCatalogo =document.querySelector(".irCatalogo")
    irCatalogo.textContent = "Inicio"

    navCabecera.style.position = "static"

    //oculto el cover
    cover2.style.display = "none"

    window.addEventListener('scroll', () =>{})
}
const ocultarCatalogo = ()=>{
    paginaVenta.classList.remove("ocultarPaginaVenta")
    paginaCatalogo.classList.add("ocultarPaginaCatalogo")

    navCabecera.style.position = "sticky"

    cover2.style.display = "flex"

    cambiarStilosNav()
}
mostrarCatalogo()



//logica para ir al footer
const nav_contacto = document.querySelector(".nav_contacto").addEventListener("click",()=>{
    const seccionContacto = document.querySelector(`.seccion-contacto`).scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
})

const ocultarElemento = (clase)=>{
    document.querySelector(`.${clase}`).style.display = "none"
}
const MostrarElemento = (clase,display)=>{
    document.querySelector(`.${clase}`).style.display = display
}

//logica para abrir y cerrar la ventana modal de producto o producto focus
const mostrarVentanaProductoFocus =()=>{
    // Mostrar la ventana modal
    const modalOverlay = document.querySelector(".modal-overlay");
    modalOverlay.classList.add("mostrarOvelayModal")

    /* const categoriaNav = document.querySelector(".main-nav")
    categoriaNav.style.display = "none" */

    document.body.classList.add("no-scroll");

    //oculto la cabecera
    ocultarElemento("cabecera")
}

//evento que cierra el focus del producto
const cerrarVentanaProductoFocus = ()=>{
   /* const categoriaNav = document.querySelector(".main-nav")
   categoriaNav.style.display = "flex" */

   const modalOverlay = document.querySelector(".modal-overlay");
   modalOverlay.classList.remove("mostrarOvelayModal")

   document.body.classList.remove("no-scroll");
//muestro la cabecera
   MostrarElemento("cabecera","flex")
}
document.querySelector(".botonCerrarFocusProductos").addEventListener("click",cerrarVentanaProductoFocus)


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


//obtengo el mainHeader para quitarle el position
const mainHeader = document.querySelector(".main-header")

const mostrarNavLateral=()=>{
    const mainNavLateral = document.querySelector(".main-nav_lateral")
    mainNavLateral.classList.add("mostraMain-nav_lateral")
    //oculto el header de categoria
    const categoriaNav = document.querySelector(".main-nav")
    categoriaNav.style.display = "none"
    document.body.classList.add("no-scroll");

    mainHeader.style.position = "static"

    //oculto la cabecera
    ocultarElemento("cabecera")
}

const ocultarNavLateral=()=>{
    const mainNavLateral = document.querySelector(".main-nav_lateral")
    mainNavLateral.classList.remove("mostraMain-nav_lateral")
    //muestro el header de categoria
    const categoriaNav = document.querySelector(".main-nav")
    categoriaNav.style.display = "flex"
     //devulvo el scoll al body
    document.body.classList.remove("no-scroll");

    mainHeader.style.position = "sticky"

    //muestro la cabecera
    MostrarElemento("cabecera","flex")

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

