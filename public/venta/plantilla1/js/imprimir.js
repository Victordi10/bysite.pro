
//logica para llamara los datos del negocio
const llamarDatosNegocio = async ()=>{
    const negocioNombre = document.getElementById("negocioNombre").textContent
    const idNegocio =  document.getElementById("idNegocio").value
    console.log(idNegocio)
    const id_unico =  document.getElementById("id_unico_dueno").value
    try {
        mostrarProgressBar("#progessBar-container_obtener")
        const response = await fetch(`/negocio/obtener`)
        if (!response.ok) {
            const imprimirMen_obtener = document.querySelector(".imprimirMen_obtener")
            imprimirMen_obtener.style.display = "block"
            imprimirMen_obtener.textContent = "Ocurrio un error al obtener los productos. Intentalo mas tarde"
            mostrarModalMensajes()
            throw new Error(`Error al cargar los datos del negocio: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al cargar los datos del negocio:", error);
        throw error; // Propaga el error para que se maneje en el contexto de llamada
    }
} 

let botonResaltado = null;

const crearBotonCategoria = (categoria, clase, lateral = false) => {
    const botonCategoria = document.createElement("button"); // Crear elemento de botón
    botonCategoria.classList.add(clase); // Agregar clase principal
    botonCategoria.classList.add(`${categoria ? categoria.replace(/\s+/g, '_') : "sinCategoria"}`); // Agregar clase específica de la categoría
    botonCategoria.textContent = categoria ? categoria.replace(/_/g, ' ') : "Otros"; // Establecer el texto del botón
    botonCategoria.setAttribute("data-categoria", categoria || "Otros"); // Establecer atributo de datos para la categoría

    if (!lateral) { // Si no es un botón lateral
        botonCategoria.id = categoria ? `${categoria}_boton` : "Otros_boton"; // Establecer ID del botón
    }

    // Agregar manejo de evento click
    botonCategoria.addEventListener("click", (e) => {
        const cateHeader = botonCategoria.getAttribute("data-categoria").replace(/\s+/g, '_'); // Obtener el nombre de la categoría del atributo de datos
        const categoriaSeccion = document.querySelector(`#${cateHeader}`); // Seleccionar la sección de la categoría
        categoriaSeccion.scrollIntoView({ behavior: "smooth", block: "start" }); // Hacer scroll a la sección de la categoría

        // Crear observador de intersección para ajustar el desplazamiento
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Calcular la posición de scroll deseada
                    const offset = categoriaSeccion.getBoundingClientRect().top + window.scrollY - (window.innerHeight * 0.1); // 10vh desde el borde superior

                    // Hacer scroll a la posición calculada
                    window.scrollTo({
                        top: offset,
                        behavior: "smooth"
                    });

                    observer.disconnect(); // Dejar de observar una vez ajustado el desplazamiento
                }
            });
        }, { threshold: 1.0 });

        observer.observe(categoriaSeccion); // Observar la sección de la categoría

        // Manejar clases de resaltado
        if (!lateral) { // Si no es un botón lateral
            if (botonResaltado) {
                botonResaltado.classList.remove("resaltarCategoria"); // Quitar clase de resaltado del botón resaltado
            }
            e.target.classList.add("resaltarCategoria"); // Agregar clase de resaltado al botón actual
            botonResaltado = e.target; // Establecer el botón actual como el botón resaltado
        } else { // Si es un botón lateral
            const botonCate = document.getElementById(`${cateHeader}_boton`); // Obtener el botón principal de la categoría
            if (botonResaltado) {
                botonResaltado.classList.remove("resaltarCategoria"); // Quitar clase de resaltado del botón resaltado
            }
            botonCate.classList.add("resaltarCategoria"); // Agregar clase de resaltado al botón principal
            botonResaltado = botonCate; // Establecer el botón principal como el botón resaltado
            ocultarNavLateral(); // Ocultar el menú lateral
        }
    });

    return botonCategoria; // Devolver el botón creado
};


// Función para imprimir las categorías en el DOM y crear los contenedores
const imprimirCategorias = (categorias) => {
    const mainCatalogo = document.querySelector(".main-categorias"); // Seleccionar el contenedor principal de categorías
    const headerCategorias = document.querySelector(".nav-categorias"); // Seleccionar el contenedor del header de categorías
    const headerCategoriasLateral = document.querySelector(".nav-categorias_lateral"); // Seleccionar el contenedor lateral del header de categorías

    categorias.forEach(categoria => {
        const catNombre = categoria.categoria ? categoria.categoria.replace(/\s+/g, '_') : "Otros"; // Obtener el nombre de la categoría sin espacios
        const catNombreDisplay = categoria.categoria ? categoria.categoria.replace(/_/g, ' ') : "Otros"; // Obtener el nombre de la categoría para mostrar

        // Crear contenedor de categoría
        const conCategoria = document.createElement("section"); 
        conCategoria.classList.add("categoria-container");
        conCategoria.id = catNombre;

        // Crear título de categoría
        const tituloCategoria = document.createElement("h2");
        tituloCategoria.classList.add("categoria-nombre");
        tituloCategoria.textContent = catNombreDisplay;

        // Crear contenedor de productos
        const conProductos = document.createElement("div");
        conProductos.classList.add("catagoria-productos_container");

        // Agregar elementos al DOM
        if (categoria.categoria === null) {
            mainCatalogo.appendChild(conCategoria); // Agregar contenedor de categoría al contenedor principal
        } else {
            mainCatalogo.insertBefore(conCategoria, mainCatalogo.firstChild); // Agregar contenedor de categoría al inicio del contenedor principal
        }
        conCategoria.appendChild(tituloCategoria); // Agregar título de categoría al contenedor de categoría
        conCategoria.appendChild(conProductos); // Agregar contenedor de productos al contenedor de categoría

        // Crear y agregar botones de categoría
        const botonCategoria = crearBotonCategoria(categoria.categoria, "main-header_boton"); // Crear botón de categoría principal
        const botonCategoriaLateral = crearBotonCategoria(categoria.categoria, "main-header_boton_lateral", true); // Crear botón de categoría lateral

        // Si la categoría es "Otros", agregar al final del header y lateral
        if (categoria.categoria === null) {
            headerCategorias.appendChild(botonCategoria); // Agregar botón de categoría principal al header
            headerCategoriasLateral.appendChild(botonCategoriaLateral); // Agregar botón de categoría lateral al header lateral
        } else {
            // Si no es "Otros", agregar al inicio del header y lateral
            headerCategorias.insertBefore(botonCategoria, headerCategorias.firstChild); // Agregar botón de categoría principal al inicio del header
            headerCategoriasLateral.insertBefore(botonCategoriaLateral, headerCategoriasLateral.children[1]); // Insertar después del primer hijo
        }

    });

    // Agregar manejadores de eventos para los botones del menú lateral
    document.getElementById("botonAbrirNavLateral").addEventListener("click", mostrarNavLateral); // Manejador para abrir el menú lateral
    document.getElementById("botonCerrarNavLateral").addEventListener("click", ocultarNavLateral); // Manejador para cerrar el menú lateral
};

//funcion para cada 3 numeros un punto
function formatNumberWithDots(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
const limitarTexto = (elemento, limite) => {
    const texto = elemento.textContent;
    if (texto.length > limite) {
        elemento.textContent = texto.substring(0, limite) + '...';
    }
};

const agregarProductoFocus =(nombre,precio,foto,descripcion)=>{
    // Actualizar los elementos dentro de la ventana modal
    document.querySelector(".producto-focus_nombre").textContent = nombre;
    document.querySelector(".producto-focus_precio").textContent = `$${precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
    const descripProducto = document.querySelector(".producto-focus_descripcion")
    descripProducto.textContent = descripcion;
    document.getElementById("productoFocusFoto").src = foto;
    
    // La cantidad del producto desde la ventana modal
    const productoFocusCan = document.querySelector(".producto-focus_mostrarCan");
    let cantidad = 1;
    productoFocusCan.textContent = cantidad;
    
    // Botones de subir y bajar la cantidad del producto desde el focus del producto
    const btnBajarCan = document.querySelector(".producto-focus_bajarCan");
    const btnSubirCan = document.querySelector(".producto-focus_subirCan");
    
    // Lógica para bajar la cantidad
    btnBajarCan.addEventListener("click", function() {
        if (cantidad > 1) {
            cantidad--;
        }
        productoFocusCan.textContent = cantidad;
        botonGregarCarrito.dataset.cantidad = cantidad;
    });
    
    // Lógica para subir la cantidad
    btnSubirCan.addEventListener("click", function() {
        cantidad++;
        productoFocusCan.textContent = cantidad;
        botonGregarCarrito.dataset.cantidad = cantidad;
    });
    
    // Lógica para agregar el producto al carrito
    const botonGregarCarrito = document.querySelector(".boton-gregar_carrito");
    botonGregarCarrito.dataset.nombre = nombre;
    botonGregarCarrito.dataset.precio = precio;
    botonGregarCarrito.dataset.foto = foto;
    botonGregarCarrito.dataset.descripcion = descripcion;
    botonGregarCarrito.dataset.cantidad = cantidad;
    
    // Mostrar la ventana modal del producto
    mostrarVentanaProductoFocus();
}

// Función para imprimir los productos en el DOM
const imprimirProductos = (productos) => {
    const id_unico = document.getElementById("id_unico_dueno").value;
    productos.forEach(producto => {
        const article = document.createElement("article");
        article.classList.add("producto-container");

        const fotoProducto = document.createElement("img");
        fotoProducto.classList.add("producto_foto");
        fotoProducto.alt = producto.producto_descripcion;
        fotoProducto.loading = "lazy";
        fotoProducto.src = producto.producto_logo ? `/${id_unico}/${producto.producto_logo}` : "../../../img/añadir.png";
        fotoProducto.dataset.nombre = producto.producto_nombre.replace(/_/g, ' ');
        fotoProducto.dataset.descripcion = producto.producto_descripcion;
        fotoProducto.dataset.precio = producto.producto_precio;
        fotoProducto.dataset.foto = producto.producto_logo ? `/${id_unico}/${producto.producto_logo}` : "../../img/añadir.png";
        
        fotoProducto.addEventListener("click", function() {
            // Obtener los valores de los atributos data-*
            const nombre = this.dataset.nombre;
            const descripcion = this.dataset.descripcion;
            const precio = this.dataset.precio;
            const foto = this.dataset.foto;
            //muestro el producto en focus
            agregarProductoFocus(nombre,precio,foto,descripcion)

        });

        const conDetalles = document.createElement("div");
        conDetalles.classList.add("producto-container_detalles");
        

        const nombreProducto = document.createElement("span");
        nombreProducto.classList.add("producto_nombre");
        nombreProducto.textContent = producto.producto_nombre.replace(/_/g, ' ');

        const descripProducto = document.createElement("p");
        descripProducto.classList.add("producto_descripcion");
        descripProducto.textContent = producto.producto_descripcion;
        limitarTexto(descripProducto, 30);

        const conFooter = document.createElement("div");
        conFooter.classList.add("producto-container_footer");

        const precioProducto = document.createElement("span");
        precioProducto.classList.add("producto-precio");
        const pecio = formatNumberWithDots(producto.producto_precio)
        precioProducto.textContent = `$${pecio}`;

        // Botón de añadir al carrito con un icono más acorde
        const boAñaCarrito = document.createElement("i");
        boAñaCarrito.classList.add("boAñaCarrito", "fas", "fa-shopping-cart");
        boAñaCarrito.dataset.nombre = producto.producto_nombre.replace(/_/g, ' ');
        boAñaCarrito.dataset.descripcion = producto.producto_descripcion;
        boAñaCarrito.dataset.precio = producto.producto_precio;
        boAñaCarrito.dataset.foto = producto.producto_logo ? `/${id_unico}/${producto.producto_logo}` : "../../img/añadir.png";
        
        boAñaCarrito.addEventListener("click", function() {
            // Obtener los valores de los atributos data-*
            const nombre = this.dataset.nombre;
            const descripcion = this.dataset.descripcion;
            const precio = this.dataset.precio;
            const foto = this.dataset.foto;
            //muestro el producto en focus
            agregarProductoFocus(nombre,precio,foto,descripcion)

        });

        // Contenedor para imprimir los productos 
        const conCategoriaId = producto.categoria ? producto.categoria.replace(/\s+/g, '_') : "Otros";
        const conProductos = document.querySelector(`#${conCategoriaId} .catagoria-productos_container`);

        // Ensamblar el DOM
        conProductos.appendChild(article);
        article.appendChild(fotoProducto);
        article.appendChild(conDetalles);
        conDetalles.appendChild(nombreProducto);
        conDetalles.appendChild(descripProducto);
        conDetalles.appendChild(conFooter);
        conFooter.appendChild(precioProducto);
        conFooter.appendChild(boAñaCarrito);
    });
};

//imprimo los productos destacado o otros
const carouselRecientes = document.querySelector('#seccion-productos_recientes');
const carouselDestacados = document.querySelector('#seccion-productos_destacados');
const carouselRecomendados = document.querySelector('#seccion-productos_recomendados');

let canDes = 0
let canReco = 0
let canUlAgr = 0
const imprimirSeccionesProductos = (productos)=>{
    productos.forEach(producto =>{
        if(producto.recomendado){
            productoEspeciales(carouselRecomendados,producto)
            canReco++
        }
         if(producto.destacado){
            productoEspeciales(carouselDestacados,producto)
            canDes++
        }
    })
    let ultimosProductos = productos.slice(-15);
    ultimosProductos.forEach(producto=>{
        canUlAgr++
        productoEspeciales(carouselRecientes,producto)
    })

    imprimirSliderSiHayElementos(canReco,canDes,canUlAgr)
};

const imprimirSliderSiHayElementos = (canReco,canDes,canUlAgr)=>{
    if(canDes > 3){
        inicializarSliders("seccion-productos_destacados")
        contenedorConSlider("seccion-productos_recomendados")
    }else{
        contenedorSinSlider("seccion-productos_destacados")
    }
    if(canReco > 3){
        inicializarSliders("seccion-productos_recomendados")
        contenedorConSlider("seccion-productos_recomendados")
    }else{
        contenedorSinSlider("seccion-productos_recomendados")
    }
    if(canUlAgr > 3){
        inicializarSliders("seccion-productos_recientes")
        contenedorConSlider("seccion-productos_recientes")
    }else{
        contenedorSinSlider("seccion-productos_recientes")
    }
}

const productoEspeciales = (contenedor, producto) => {
    const id_unico = document.getElementById("id_unico_dueno").value;

    const slide = document.createElement('div');
    slide.classList.add('slide');

    const figure = document.createElement('figure');
    figure.classList.add('producto__container-figure');

    const img = document.createElement('img');
    img.src = producto.producto_logo ? `/${id_unico}/${producto.producto_logo}` : "../../../img/añadir.png";
    img.alt = producto.producto_nombre;

    figure.appendChild(img);

    const figcaption = document.createElement('figcaption');
    figcaption.classList.add('producto__container-texto');

    const nombreProducto = document.createElement('h3');
    nombreProducto.textContent = producto.producto_nombre.replace(/_/g, ' ');
    limitarTexto(nombreProducto, 20);

    /* const descripcionProducto = document.createElement('p');
    descripcionProducto.classList.add('producto-carousel_parrafo');
    descripcionProducto.textContent = producto.producto_descripcion; */

    const precioProducto = document.createElement('p');
    precioProducto.classList.add('price');
    precioProducto.textContent = "$ " + formatNumberWithDots(producto.producto_precio);

    const botonAgregarCarrito = document.createElement('button');
    botonAgregarCarrito.classList.add('boton-add-carrito', "fas", "fa-shopping-cart");
    botonAgregarCarrito.dataset.nombre = producto.producto_nombre.replace(/_/g, ' ');
    botonAgregarCarrito.dataset.descripcion = producto.producto_descripcion;
    botonAgregarCarrito.dataset.precio = producto.producto_precio;
    botonAgregarCarrito.dataset.foto = producto.producto_logo ? `/${id_unico}/${producto.producto_logo}` : "../../img/añadir.png";
    
    botonAgregarCarrito.addEventListener("click", function() {
        // Obtener los valores de los atributos data-*
        const nombre = this.dataset.nombre;
        const descripcion = this.dataset.descripcion;
        const precio = this.dataset.precio;
        const foto = this.dataset.foto;
        //muestro el producto en focus
        agregarProductoFocus(nombre,precio,foto,descripcion)

    });

    figcaption.appendChild(nombreProducto);
    //figcaption.appendChild(descripcionProducto);
    figcaption.appendChild(precioProducto);
    figcaption.appendChild(botonAgregarCarrito);

    slide.appendChild(figure);
    slide.appendChild(figcaption);

    contenedor.appendChild(slide);
}
const contenedorSinSlider = (clase)=>{
    document.querySelector(`.${clase}`).parentNode.classList.add("conSinSlider")
}
const contenedorConSlider = (clase)=>{
    document.querySelector(`.${clase}`).parentNode.classList.remove("conSinSlider")
}
const inicializarSliders = (clase) => {
    // Destruir cualquier inicialización previa del slider
    if ($(`.${clase}`).hasClass('slick-initialized')) {
        $(`.${clase}`).slick('unslick');
    }
    
    // Inicializar el slider de Slick después de añadir los elementos
    $(document).ready(function(){
        
        $(`.${clase}`).slick({
          dots: false,
          infinite: true,
          speed: 300,
          centerMode: true,
          centerPadding: '140px',
          slidesToShow: 3,
          slidesToScroll: 2,
          autoplay: true,
          autoplaySpeed: 2000,
          prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-chevron-left botones_carousel"></i></button>',
          nextArrow: '<button type="button" class="slick-next"><i class="fas fa-chevron-right botones_carousel"></i></button>',
          responsive: [
            {
              breakpoint: 1304,
              settings: {
                centerMode: true,
                centerPadding: '50px',
                slidesToShow: 3,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 2000,
              }
            },
            {
              breakpoint: 950,
              settings: {
                centerMode: true,
                centerPadding: '80px',
                slidesToShow: 2,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 2000,
              }
            },
            {
              breakpoint: 770,
              settings: {
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 2,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 2000,
              }
            },
            {
              breakpoint: 650,
              settings: {
                centerMode: true,
                centerPadding: '130px',
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 2000,
              }
            },
            {
                breakpoint: 580,
                settings: {
                  centerMode: true,
                  centerPadding: '40px',
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  autoplay: true,
                  autoplaySpeed: 2000,
                }
              },
              {
                breakpoint: 390,
                settings: {
                  centerMode: true,
                  centerPadding: '20px',
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  autoplay: true,
                  autoplaySpeed: 2000,
                }
              },
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
          ]
        });
    });

}
const imprimirDatosNegocio =(data)=>{
    data.forEach(async(dato) => {
        const id_unico =  document.getElementById("id_unico_dueno").value

        //nombre del negocio en la cabecera
        const nombreNegocioLogo = document.querySelector(".nombreNegocioLogo")
        nombreNegocioLogo.textContent = dato.nombre.replace(/_/g, ' ') 

        //img en la cabecera
        const navLogo_img = document.querySelector(".nav-logo_img")
        navLogo_img.src = `/${id_unico}/${dato.logo}`
        navLogo_img.alt = `logo de ${dato.nombre}`
        

        /* //imprimo el logo en el cover
        const coverImg = document.querySelector(".cover-img")
        coverImg.src = `/${id_unico}/${dato.logo}`//.replace(/^\/?[^\/]+\/?/,'')
        coverImg.alt = `logo de ${dato.nombre}` */

        //imprimo el icono del logo en el head
        const logoIcon = document.getElementById("logoIcon")
        logoIcon.href = `/${id_unico}/${dato.logo}`

        //imprimo la descripcion del negocio
        const coverParrafoNegocio = document.querySelector("#cover_descripcion2")
        coverParrafoNegocio.textContent = dato.descripcion

        //agrego el numero al link de whatsApp
        const enlaceWhatsApp = document.querySelectorAll(".whatsapp").forEach(enlace=>{
            enlace.href = `https://wa.me/${dato.whatsapp}`
        })
        //imprimo el numero de telefono
        const telefonoNegocio = document.getElementById("telefono-negocio").textContent = dato.whatsapp
        const correo = document.getElementById("correo").textContent = dato.correo
        //agrego los links de las redes sociales
        const socialMediaLinks = {
            instagram: dato.instagram,
            facebook: dato.facebook,
            tiktok: dato.tiktok,
            youtube: dato.youtube
        };
        
        for (const [key, value] of Object.entries(socialMediaLinks)) {
            const elements = document.querySelectorAll(`.${key}`);
            elements.forEach(element => {
                if (value) {
                    element.href = value;
                } else {
                    element.style.display = "none";
                }
            });
        }

        
        //creo custom property para los colores
        document.documentElement.style.setProperty('--color-fondo', `${dato.color_fondo}`);
        const colorTextoFondo = await elegirColorTexto(dato.color_fondo);
            document.documentElement.style.setProperty('--color-texto-fondo', `${colorTextoFondo.colorTexto}`);
            document.documentElement.style.setProperty('--color-sombra', `${colorTextoFondo.colorSombra}`);

        document.documentElement.style.setProperty('--color-uno', `${dato.color_uno}`);
        const colorTextoUno = await elegirColorTexto(dato.color_uno);
            document.documentElement.style.setProperty('--color-texto-uno', `${colorTextoUno.colorTexto}`);

        document.documentElement.style.setProperty('--color-dos', `${dato.color_dos}`);
        const colorTextoDos = await elegirColorTexto(dato.color_dos);
            document.documentElement.style.setProperty('--color-texto-dos', `${colorTextoDos.colorTexto}`);


        let opacity1 = 0.5; 
        let opacity2 = 0.7; 
        let opacity3 = 1; 
        
        let newColorCover1 = changeOpacity(dato.color_fondo, opacity1);
        let newColorCover2 = changeOpacity(dato.color_fondo, opacity2);
        let newColorCover3 = dato.color_fondo;
        
        // Ajusto los colores para el cover
        document.documentElement.style.setProperty('--cover-1', newColorCover1);
        document.documentElement.style.setProperty('--cover-2', newColorCover2); 
        document.documentElement.style.setProperty('--cover-3', newColorCover3); 

        //imprimo los datos del cover
        document.documentElement.style.setProperty('--logo-url', `url(/${id_unico}/${dato.logo})`);
        if(dato.fondo_cover == null){
            document.documentElement.style.setProperty('--portada-url', `url(/${id_unico}/${dato.logo})`);
        }else{
            document.documentElement.style.setProperty('--portada-url', `url(/${id_unico}/${dato.fondo_cover})`);
        }

        const tituloCover = document.getElementById("cover_titulo2")
        if(dato.titulo_cover == null){
            const cover_titulo = document.querySelector(".cover_titulo").innerHTML
            tituloCover.innerHTML = cover_titulo
        }else{
            tituloCover.textContent = dato.titulo_cover
        }
    });
}

const elegirColorTexto = (hexColor) => {
    hexColor = hexColor.replace('#', '');
    let R = parseInt(hexColor.substring(0,2),16);
    let G = parseInt(hexColor.substring(2,4),16);
    let B = parseInt(hexColor.substring(4,6),16);

    let luminosidad = (R*299 + G*587 + B*114) / 1000;
    let colorTexto;
    let colorSombra;

    if (luminosidad < 128) {
        colorTexto = "#FFF";
        colorSombra = " rgba(255, 255, 255, 0.05)"; // Sombra clara para fondo oscuro
    } else {
        colorTexto = "#000";
        colorSombra = "rgba(0, 0, 0, 0.17)"; // Sombra oscura para fondo claro
    }

    return { colorTexto, colorSombra };
};

function changeOpacity(hex, opacity) {
    // Convertir el color HEX a RGB
    let [r, g, b] = hexToRgb(hex);

    // Convertir el valor de opacidad de 0 a 1 en formato RGBA
    let a = Math.max(0, Math.min(1, opacity)); // Asegura que la opacidad esté entre 0 y 1

    // Devolver el color en formato RGBA
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return [r, g, b];
}

const imprimirTipografia = (data)=>{
    document.documentElement.style.setProperty('--font_family', `${data.font_family}`);
}

const imprimirPortadaCategorias = (categorias) => {
    const mainCatalogo = document.querySelector(".categorias-content");
    const id_unico = document.getElementById("id_unico_dueno").value;

    const categoriasConNombre = categorias.filter(categoria => categoria.categoria);
    const categoriasSinNombre = categorias.filter(categoria => !categoria.categoria);

    const agregarCategoria = (categoria, esSinNombre = false) => {
        const conCategoria = document.createElement("div");
        conCategoria.classList.add("categorias");
        conCategoria.dataset.categoria = categoria.categoria ? categoria.categoria.replace(/\s+/g, '_') : "Otros";
        conCategoria.id = categoria.categoria ? `${categoria.categoria.replace(/\s+/g, '_')}_venta` : "sinCategoria_venta";
        conCategoria.addEventListener("click",(e)=>{
            mostrarCatalogo()
            setTimeout(()=>{
                const cateHeader = e.target.getAttribute("data-categoria").replace(/\s+/g, '_'); // Obtener el nombre de la categoría del atributo de datos
                const categoriaSeccion = document.querySelector(`#${cateHeader}`); // Seleccionar la sección de la categoría
                categoriaSeccion.scrollIntoView({ behavior: "smooth", block: "start" }); // Hacer scroll a la sección de la categoría
    
                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // Calcular la posición de scroll deseada
                            const offset = categoriaSeccion.getBoundingClientRect().top + window.scrollY - (window.innerHeight * 0.10); // 10vh desde el borde superior
        
                            // Hacer scroll a la posición calculada
                            window.scrollTo({
                                top: offset,
                                behavior: "smooth"
                            });
        
                            observer.disconnect(); // Dejar de observar una vez ajustado el desplazamiento
                        }
                    });
                }, { threshold: 1.0 });
        
                observer.observe(categoriaSeccion); // Observar la sección de la categoría
                },222)
        })
        setTimeout(() => {
            conCategoria.style.backgroundImage = `linear-gradient( rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url("/${id_unico}/${categoria.producto_logo}")`;
        }, 500);

        const tituloCategoria = document.createElement("h3");
        tituloCategoria.classList.add("categoria-nombre");
        tituloCategoria.textContent = esSinNombre ? "Otros" : categoria.categoria.replace(/_/g, ' ');

        conCategoria.appendChild(tituloCategoria); // Se agrega el título de categoría al contenedor de categoría
        mainCatalogo.appendChild(conCategoria); // Se agrega el contenedor de categoría al elemento principal
    };

    const longitud = Object.keys(categorias).length;
    if (longitud > 1) {
        // Agregar categorías con nombre
        categoriasConNombre.forEach(categoria => agregarCategoria(categoria));

        // Agregar categorías sin nombre
        categoriasSinNombre.forEach(categoria => agregarCategoria(categoria, true));
    } else {
        mainCatalogo.parentNode.style.display = "none";
    }
};


// Ejecutar las funciones al cargar la página
window.addEventListener("load", async () => {
     try {
        const datos = await llamarDatosNegocio();
        console.log(datos)
        imprimirDatosNegocio(datos.datos)
        if (datos.font_family) {
            imprimirTipografia(datos.font_family);
        } else {
            console.error("La propiedad font_family no está definida.");
        }
        
        imprimirPortadaCategorias(datos.catePortadas)
        imprimirCategorias(datos.categorias)
        imprimirProductos(datos.productos)
        imprimirSeccionesProductos(datos.productos)

        setTimeout(()=>{ocultarProgressBar("#progessBar-container_obtener")},2000)
    } catch (error) {
        ocultarProgressBar("#progessBar-container_obtener")
        console.error("Error al cargar los productos y categorías:", error);
        contenedorMensaje.textContent = "Error al cargar los productos intentelo mas tarde por favor"
        mostrarModalMensajes()
    } 
});

/* //funcion de permitir recepcion por whatsapp
const noRecepcionWhatsapp=()=>{
    const suscrip = document.getElementById("suscripcion").value
    if(suscrip < 3 ){
        const noRecepcionObjet = document.querySelectorAll(".noRecepcion").forEach(object=>{
            object.style.display = "none"
        })
    }
}

noRecepcionWhatsapp() 
*/