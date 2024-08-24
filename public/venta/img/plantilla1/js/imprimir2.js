
//logica para llamara los datos del negocio
const llamarDatosNegocio = async ()=>{
    const negocioNombre = document.getElementById("negocioNombre").textContent
    const idNegocio =  document.getElementById("idNegocio").value
    console.log(idNegocio)
    const id_unico =  document.getElementById("id_unico_dueno").value
    try {
        mostrarProgressBar("#progessBar-container_obtener")
        const response = await fetch(`/negocio/${negocioNombre}/${idNegocio}/obtener`)
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

// Función para imprimir las categorías en el DOM y crear los contenedores
const imprimirCategorias = (categorias) => {
    const mainCatalogo = document.querySelector(".main-categorias");

    categorias.forEach(categoria => {
        // Creo los contenedores de categorías
        const conCategoria = document.createElement("section");
        conCategoria.classList.add("categoria-container");
        conCategoria.id = categoria.categoria ? categoria.categoria.replace(/\s+/g, '_') : "Otros";

        // Título del contenedor
        const tituloCategoria = document.createElement("h2");
        tituloCategoria.classList.add("categoria-nombre");
        tituloCategoria.textContent = categoria.categoria || "Otros";

        // Contenedor para imprimir los productos
        const conProductos = document.createElement("div");
        conProductos.classList.add("catagoria-productos_container");

        mainCatalogo.appendChild(conCategoria);
        conCategoria.appendChild(tituloCategoria);
        conCategoria.appendChild(conProductos);

        // Creo los botones del header
        // Contenedor de header de categorías
        const headerCategorias = document.querySelector(".nav-categorias");

        const botonCategoria = document.createElement("button");
        botonCategoria.classList.add("main-header_boton");
        botonCategoria.classList.add(`${categoria.categoria ? categoria.categoria.replace(/\s+/g, '_') : "sinCategoria"}`);
        botonCategoria.textContent = categoria.categoria || "Otros";
        botonCategoria.id = `${categoria.categoria}_boton` || "Otros_boton";
        botonCategoria.setAttribute("data-categoria", categoria.categoria || "Otros");
        botonCategoria.setAttribute("data-boton", categoria.categoria || "Otros");

        // Lógica para navegar por las categorías con botonCategoria
        botonCategoria.addEventListener("click", function (e) {
            // Resalto la categoría del header
            if (botonResaltado) {
                botonResaltado.classList.remove("resaltarCategoria");
            }
            e.target.classList.add("resaltarCategoria");
            botonResaltado = e.target;

            const cateHeader = e.target.getAttribute("data-categoria").replace(/\s+/g, '_');
            // Ir a la categoría al dar click
            const categoriaSeccion = document.querySelector(`#${cateHeader}`).scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });

        headerCategorias.appendChild(botonCategoria);

        // Contenedor de categorías lateral
        const headerCategoriasLateral = document.querySelector(".nav-categorias_lateral");
        const botonCategoriaLateral = document.createElement("button");
        botonCategoriaLateral.classList.add("main-header_boton_lateral");
        botonCategoriaLateral.classList.add(`${categoria.categoria ? categoria.categoria.replace(/\s+/g, '_') : "sinCategoria"}`);
        botonCategoriaLateral.textContent = categoria.categoria || "Otros";
        botonCategoriaLateral.setAttribute("data-categoria", categoria.categoria || "Otros");

        // Lógica para navegar por las categorías con botonCategoriaLateral
        botonCategoriaLateral.addEventListener("click", function (e) {
            const cateHeader = e.target.getAttribute("data-categoria").replace(/\s+/g, '_');
            // Ir a la categoría al dar click
            const categoriaSeccion = document.querySelector(`#${cateHeader}`).scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
            const botonCate = document.getElementById(`${cateHeader}_boton`)
            if (botonResaltado) {
                botonResaltado.classList.remove("resaltarCategoria");
            }
            botonCate.classList.add("resaltarCategoria");
            botonResaltado = botonCate;

            ocultarNavLateral();
        });

        headerCategoriasLateral.appendChild(botonCategoriaLateral);

        // Obtengo el botón de mostrar el nav categorías lateral
        const botonAbrirNavLateral = document.getElementById("botonAbrirNavLateral").addEventListener("click", () => mostrarNavLateral());

        // Obtengo el botón de ocultar el nav categorías lateral
        const botonCerrarNavLateral = document.getElementById("botonCerrarNavLateral").addEventListener("click", () => ocultarNavLateral());
    });
};

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

        const conDetalles = document.createElement("div");
        conDetalles.classList.add("producto-container_detalles");

        const nombreProducto = document.createElement("span");
        nombreProducto.classList.add("producto_nombre");
        nombreProducto.textContent = producto.producto_nombre;

        const descripProducto = document.createElement("p");
        descripProducto.classList.add("producto_descripcion");
        descripProducto.textContent = producto.producto_descripcion;

        const conFooter = document.createElement("div");
        conFooter.classList.add("producto-container_footer");

        const precioProducto = document.createElement("span");
        precioProducto.classList.add("producto-precio");
        precioProducto.textContent = `$${producto.producto_precio}`;

        // Botón de añadir al carrito con un icono más acorde
        const boAñaCarrito = document.createElement("i");
        boAñaCarrito.classList.add("boAñaCarrito", "fas", "fa-shopping-cart");
        boAñaCarrito.dataset.nombre = producto.producto_nombre;
        boAñaCarrito.dataset.descripcion = producto.producto_descripcion;
        boAñaCarrito.dataset.precio = producto.producto_precio;
        boAñaCarrito.dataset.foto = producto.producto_logo ? `/${id_unico}/${producto.producto_logo}` : "../../img/añadir.png";
        
        boAñaCarrito.addEventListener("click", function() {
            // Obtener los valores de los atributos data-*
            const nombre = this.dataset.nombre;
            const descripcion = this.dataset.descripcion;
            const precio = this.dataset.precio;
            const foto = this.dataset.foto;

            // Actualizar los elementos dentro de la ventana modal
            document.querySelector(".producto-focus_nombre").textContent = nombre;
            document.querySelector(".producto-focus_precio").textContent = `$${precio}`;
            document.querySelector(".producto-focus_descripcion").textContent = descripcion;
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



const imprimirDatosNegocio =(data)=>{
    data.forEach(dato => {
        //nombre del negocio en la cabecera
        const nombreNegocioLogo = document.querySelector(".nombreNegocioLogo")
        nombreNegocioLogo.textContent = dato.nombre
        //imprimo el logo en el cover
        const coverImg = document.querySelector(".cover-img")
        const id_unico =  document.getElementById("id_unico_dueno").value
        coverImg.src = `/${id_unico}/${dato.logo}`//.replace(/^\/?[^\/]+\/?/,'')
        //imprimo el icono del logo en el head
        const logoIcon = document.getElementById("logoIcon")
        logoIcon.href = `/${id_unico}/${dato.logo}`
        //imprimo la descripcion del negocio
        const coverParrafoNegocio = document.querySelector("#cover-parrafoNegocio")
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
        document.documentElement.style.setProperty('--color-uno', `${dato.color_uno}`);
        document.documentElement.style.setProperty('--color-dos', `${dato.color_dos}`);
    });
}

const imprimirPortadaCategorias = (categorias) => {
    const mainCatalogo = document.querySelector(".categorias-content");
    const id_unico =  document.getElementById("id_unico_dueno").value
    categorias.forEach(categoria => {
        const conCategoria = document.createElement("div");
        conCategoria.classList.add("categorias");
        conCategoria.classList.add(categoria.categoria ? categoria.categoria.replace(/\s+/g, '_') : "sinCategoria");
        conCategoria.id = categoria.categoria ? `${categoria.categoria.replace(/\s+/g, '_')}_venta`: "sinCategoria_venta";
        setTimeout(() => {
            conCategoria.style.backgroundImage = `linear-gradient( rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url("/${id_unico}/${categoria.producto_logo}")`;
        }, 500);

        const tituloCategoria = document.createElement("h3");
        tituloCategoria.classList.add("categoria-nombre");
        tituloCategoria.textContent = categoria.categoria || "Otros";

        mainCatalogo.appendChild(conCategoria); // Se agrega el contenedor de categoría al elemento principal
        conCategoria.appendChild(tituloCategoria); // Se agrega el título de categoría al contenedor de categoría
    });
};



// Ejecutar las funciones al cargar la página
window.addEventListener("load", async () => {
     try {
        const datos = await llamarDatosNegocio();
        console.log(datos)
        imprimirDatosNegocio(datos.datos)
        imprimirPortadaCategorias(datos.catePortadas)
        imprimirCategorias(datos.categorias)
        imprimirProductos(datos.productos)
        noRecepcionWhatsapp()

        setTimeout(()=>{ocultarProgressBar("#progessBar-container_obtener")},2000)
    } catch (error) {
        ocultarProgressBar("#progessBar-container_obtener")
        console.error("Error al cargar los productos y categorías:", error);
        contenedorMensaje.textContent = "Error al cargar los productos y categorías"
        mostrarModalMensajes()
        setTimeout(()=>{location.reload()},4000)

    } 
});

//funcion de permitir recepcion por whatsapp
const noRecepcionWhatsapp=()=>{
    const suscrip = document.getElementById("suscripcion").value
    if(suscrip < 2 ){
        const noRecepcionObjet = document.querySelectorAll(".noRecepcion").forEach(object=>{
            object.style.display = "none"
        })
    }
}