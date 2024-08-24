//boton para mostrar las opciones de agregar
document.getElementById('btnAgregarInventario').addEventListener('click', function () {
    var dropdown = document.getElementById('inventarioDropdown');
    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'flex';
    } else {
        dropdown.style.display = 'none';
    }
});

// Cerrar el menú desplegable si se hace clic fuera de él
window.onclick = function (event) {
    if (!event.target.matches('#btnAgregarInventario')) {
        var dropdown = document.getElementById('inventarioDropdown');
        if (dropdown.style.display === 'flex') {
            dropdown.style.display = 'none';
        }
    }
};

// Logica para imprimir los resultados de productos
const imprimirResultados = (resultados) => {
    const resultadoContainer = document.getElementById("resultado_buscador");

    resultados.forEach(resultado => {
        const productoContainer = crearProductoContainer(resultado);
        resultadoContainer.appendChild(productoContainer);
    });
}

let contenedorOpcionesAbierto = null;  // Variable para rastrear el contenedor de opciones abierto

// Función para crear un contenedor de producto y sus elementos hijos
const crearProductoContainer = (producto) => {
    const productoContainer = document.createElement("article");
    productoContainer.classList.add("producto-container");

    const fotoProducto = crearFotoProducto(producto);
    const conDetalles = crearDetallesProducto(producto);
    
    
    const opcionesProductos = document.createElement("i");
    opcionesProductos.classList.add("fas", "fa-ellipsis-v", "producto-boton", "producto_icono");

    const contenedorOpciones = crearOpcionesProducto(producto);
    contenedorOpciones.style.display = "none";  // Inicialmente oculto

    opcionesProductos.addEventListener("click", (e) => {
        e.stopPropagation();  // Evitar que el evento de clic se propague
        if (contenedorOpcionesAbierto && contenedorOpcionesAbierto !== contenedorOpciones) {
            contenedorOpcionesAbierto.style.display = "none";  // Cerrar el contenedor abierto anterior
        }
        contenedorOpciones.style.display = contenedorOpciones.style.display === "flex" ? "none" : "flex";
        contenedorOpcionesAbierto = contenedorOpciones.style.display === "flex" ? contenedorOpciones : null;  // Actualizar el contenedor abierto
    });

    document.addEventListener("click", (event) => {
        if (contenedorOpcionesAbierto && !contenedorOpcionesAbierto.contains(event.target) && !opcionesProductos.contains(event.target)) {
            contenedorOpcionesAbierto.style.display = "none";
            contenedorOpcionesAbierto = null;
        }
    });

    productoContainer.appendChild(fotoProducto);
    productoContainer.appendChild(conDetalles);
    productoContainer.appendChild(opcionesProductos);
    productoContainer.appendChild(contenedorOpciones);

    return productoContainer;
};

const asignarDatasets =(elemento,producto)=>{
    elemento.setAttribute("data-logo", producto.producto_logo);
    elemento.setAttribute("data-nombre", producto.producto_nombre);
    elemento.setAttribute("data-id", producto.id);
}
const crearFotoProducto = (producto) => {
    const fotoProducto = document.createElement("div");
    fotoProducto.classList.add("producto_foto_container");

    fotoProducto.style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.2)), url("${(producto.producto_logo ? producto.producto_logo : "../../../img/añadir.png")}")`;

    fotoProducto.id = `fotoProducto${producto.id}`;

    fotoProducto.loading = "lazy";
    asignarDatasets(fotoProducto,producto)

    fotoProducto.addEventListener("click", (e) => {
        // Mostrar el formulario de actualización
        mostrarSeccionFormulario(seccionFormularioArchivo);
        const productoNombre = e.target.getAttribute("data-nombre");
        const productoLogo = e.target.getAttribute("data-logo");
        const productoID = e.target.getAttribute("data-id");

        const idImg = e.target.id;

        verificarSesion(() => actualizarArchivo(actualizarFotoProducto, productoNombre, productoID, idImg));
        const label = document.getElementById('actualizarLabel_label')
        console.log(productoLogo)
        if(productoLogo != 'null'){
            label.innerHTML = `<img src='${productoLogo}' class="mostrarImagen_archivo" alt='2'>`;
        }else{
            noHayImagen()
        }

    });

/*     const iconEditar = document.createElement("i");
    iconEditar.classList.add("fas", "fa-pencil-alt", "boton_editar_foto");
    asignarDatasets(iconEditar, producto);
    fotoProducto.appendChild(iconEditar); */

    return fotoProducto;
};

const crearDetallesProducto = (producto) => {
    const conDetalles = document.createElement("div");
    conDetalles.classList.add("producto-container_detalles");

    const nombreProducto = document.createElement("span");
    nombreProducto.classList.add("producto_nombre");
    nombreProducto.id = `productoNom${producto.id}`
    nombreProducto.textContent = producto.producto_nombre.replace(/_/g, ' ');

    const descripProducto = document.createElement("p");
    descripProducto.classList.add("producto_descripcion");
    descripProducto.textContent = producto.producto_descripcion;
    limitarTexto(descripProducto, 30);
    descripProducto.id = `productoDes${producto.id}`

    const precioProducto = document.createElement("span");
    precioProducto.classList.add("producto-precio");
    const precio = formatNumberWithDots(producto.producto_precio);
    precioProducto.textContent = "$"+precio; 
    precioProducto.id = `productoPrecio${producto.id}`

    conDetalles.appendChild(nombreProducto);
    conDetalles.appendChild(descripProducto);
    conDetalles.appendChild(precioProducto);

    return conDetalles;
};


// Función para crear las opciones de producto
const crearOpcionesProducto = (producto) => {
    const contenedorOpciones = document.createElement("div");
    contenedorOpciones.classList.add("producto_contenedor__opciones");

    const btnBorrarProducto = document.createElement("button");
btnBorrarProducto.classList.add("producto-boton", "boton_borrar");
btnBorrarProducto.setAttribute("data-id", producto.id);
btnBorrarProducto.setAttribute("data-nombre", producto.producto_nombre);
btnBorrarProducto.innerHTML = '<i class="fas fa-trash-alt"></i> Borrar';
btnBorrarProducto.addEventListener("click", (e) => {
    e.stopPropagation();
    const producto_id = e.currentTarget.getAttribute("data-id");
    const productoNombre = e.currentTarget.getAttribute("data-nombre");

    if (producto_id && productoNombre) {
        const contenedorTextoDelete = document.getElementById("contenedorTextoDelete").textContent = "El producto";
        mostrarPreguntaEliminacion();
        document.querySelector(".pregunta_cancelar").onclick = ocultarPreguntaEliminacion;
        document.querySelector(".pregunta_aceptar").onclick = () => {
            verificarSesion(()=>{borrarProducto(productoNombre, producto_id)});
            ocultarPreguntaEliminacion();
        };
    } else {
        console.error("Los atributos data-* no están presentes o son nulos");
    }
});

const btnEditarProducto = document.createElement("button");
btnEditarProducto.classList.add("producto-boton", "boton_editar");
btnEditarProducto.innerHTML = '<i class="fas fa-edit"></i> Editar';
btnEditarProducto.id = `editar${producto.id}`;
btnEditarProducto.setAttribute("data-id", producto.id);
btnEditarProducto.setAttribute("data-logo", producto.producto_logo ? producto.producto_logo : "../../../img/añadir.png");
btnEditarProducto.setAttribute("data-nombre", producto.producto_nombre.replace(/_/g, ' '));
btnEditarProducto.setAttribute("data-precio", producto.producto_precio);
btnEditarProducto.setAttribute("data-desc", producto.producto_descripcion);
btnEditarProducto.addEventListener("click", (e) => {
    e.stopPropagation();
    const producto_id = e.currentTarget.getAttribute("data-id");
    const productoNombre = e.currentTarget.getAttribute("data-nombre");
    const productoPrecio = e.currentTarget.getAttribute("data-precio");
    const productoDesc = e.currentTarget.getAttribute("data-desc");
    const productoImg = e.currentTarget.getAttribute("data-logo");

    mostrarSeccionFormulario(seccionFormularioInfo);
    document.getElementById("productoNombreActualizar").value = productoNombre;
    document.getElementById("productoPrecioActualizar").value = productoPrecio;
    document.getElementById("productoDescActualizar").value = productoDesc;

    const conImgForm = document.querySelector(".producto-header_logo");
    conImgForm.src = productoImg;
    conImgForm.setAttribute("data-id", producto_id);
    conImgForm.setAttribute("data-pronombre", productoNombre);

    const figureProducto = document.querySelector(".figure-producto");
    figureProducto.addEventListener("click", (e) => {
        mostrarSeccionFormulario(seccionFormularioArchivo);
        verificarSesion(() => actualizarArchivo(actualizarFotoProducto, productoNombre, producto_id));

        
        const label = document.getElementById('actualizarLabel_label')
        label.innerHTML = `<img src='${(productoImg ? productoImg : "../../../img/añadir.png")}' class="mostrarImagen_archivo" alt='1'>`
        ocultarSecionFormulario(seccionFormularioInfo);
    });

        const formBtnGuardar_Info = document.querySelector("#formBtnGuardar_Info");
        formBtnGuardar_Info.addEventListener("click", () => {
            const productoNombreActualizar = document.getElementById("productoNombreActualizar").value;
            const productoPrecioActualizar = document.getElementById("productoPrecioActualizar").value;
            const productoDescActualizar = document.getElementById("productoDescActualizar").value;

            const nuevosDatos = {
                productoId: producto_id,
                productoNombre: productoNombreActualizar,
                productoPrecio: productoPrecioActualizar,
                productoDesc: productoDescActualizar,
            };

            verificarSesion(()=>{actualizarDetalles(productoNombre, nuevosDatos)});
        });
    });
    
    const btnRecomendar = document.createElement("button");
    btnRecomendar.classList.add("producto-boton", "boton_recomendar");
    btnRecomendar.setAttribute("data-id", producto.id);
    btnRecomendar.setAttribute("data-recomendado", producto.recomendado);
    btnRecomendar.textContent = producto.recomendado == 1 ? "No Recomendar" : "Recomendar";

    btnRecomendar.addEventListener("click", (e) => {
        e.stopPropagation();
        const productoID = e.target.dataset.id;
        const recomendado = e.target.dataset.recomendado == 1 ? 0 : 1;

        btnRecomendar.textContent = recomendado == 1 ? "No Recomendar" : "Recomendar";
        e.target.setAttribute("data-recomendado", recomendado);
        
        recomendarProducto(recomendado, productoID);
    });


    const btnDestacar = document.createElement("button");
    btnDestacar.classList.add("producto-boton", "boton_destacar");
    btnDestacar.setAttribute("data-id", producto.id);
    btnDestacar.setAttribute("data-destacado", producto.destacado);
    btnDestacar.textContent = producto.destacado == 1 ? "No Destacar" : "Destacar";

    btnDestacar.addEventListener("click", (e) => {
        e.stopPropagation();
        const productoID = e.target.dataset.id;
        const destacado = e.target.dataset.destacado == 1 ? 0 : 1;

        btnDestacar.textContent = destacado == 1 ? "No Destacar" : "Destacar";
        e.target.setAttribute("data-destacado", destacado);

        destacarProducto(destacado, productoID);
    });

    contenedorOpciones.appendChild(btnEditarProducto);
    contenedorOpciones.appendChild(btnBorrarProducto);
    contenedorOpciones.appendChild(btnDestacar);
    contenedorOpciones.appendChild(btnRecomendar);
    

    return contenedorOpciones;
};

const limitarTexto = (elemento, limite) => {
    const texto = elemento.textContent;
    if (texto.length > limite) {
        elemento.textContent = texto.substring(0, limite) + '...';
    }
};
// Función para imprimir los productos en el DOM
const imprimirProductos = (productos) => {
    productos.forEach(producto => {
        const conCategoriaId = producto.categoria ? producto.categoria.replace(/\s+/g, '_') : "sinCategoria";
        const conCategoria = document.querySelector(`#${conCategoriaId}`);
        const contendorProductos = conCategoria.querySelector(".categoriaProductosContainer");

        const productoContainer = crearProductoContainer(producto);
        contendorProductos.appendChild(productoContainer);
    });
};
