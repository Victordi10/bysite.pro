//logica para mostrar y cerrar el carrito
const mostrarCarrito =()=>{
    const seccionCarrito = document.querySelector(".seccion-carrito")
    seccionCarrito.classList.add("mostrarCarrito")

    //oculto el header de categoria
    const categoriaNav = document.querySelector(".main-nav")
    categoriaNav.style.display = "none"

    document.body.classList.add("no-scroll");
}
const ocultarCarrito = ()=>{
    const seccionCarrito = document.querySelector(".seccion-carrito")
    seccionCarrito.classList.remove("mostrarCarrito")

    //oculto el header de categoria
    const categoriaNav = document.querySelector(".main-nav")
    categoriaNav.style.display = "flex"

    document.body.classList.remove("no-scroll");
}
const mainNavBotonCarrito = document.getElementById("mainNavBotonCarrito").addEventListener("click",mostrarCarrito)

const carritoCerrarBoton = document.querySelector(".carritoCerrarBoton").addEventListener("click",ocultarCarrito)


//funciones que muestra el form de carrito y que tambien lo oculta
const mostrarFormCarrito=()=>{
    const carritoFormualrio = document.querySelector(".seccion-formulario_carrito")
    carritoFormualrio.style.display = "flex"
    const carritoContainer = document.querySelector(".carrito-container")
    carritoContainer.style.display = "none"
}
const ocultarFormCarrito=()=>{
    const carritoFormualrio = document.querySelector(".seccion-formulario_carrito")
    carritoFormualrio.style.display = "none"
    const carritoContainer = document.querySelector(".carrito-container")
    carritoContainer.style.display = "flex"
}
    //boton de esconder el form carrito
    const CerrarFormCarrito =document.querySelector(".CerrarFormCarrito")
    CerrarFormCarrito.addEventListener("click",ocultarFormCarrito)
    
    //funcion para solo selecionar un checkbox
// Función para mostrar/ocultar campos basados en la opción seleccionada
const soloUnCheckbox = (checkboxSeleccionado) => {
    if (checkboxSeleccionado.checked) {
        document.querySelectorAll(`input[name="opcionEntrega"]`).forEach(checkbox => {
            if (checkbox !== checkboxSeleccionado) {
                checkbox.checked = false;
            }
        });
    }

    const direccionContainer = document.getElementById("direccion-container");
    if (checkboxSeleccionado.id == "aDomicilio" && checkboxSeleccionado.checked) {
        direccionContainer.style.display = "flex";
    } else {
        direccionContainer.style.display = "none";
    }
};
    

    // Función para mostrar el campo de cambio si se selecciona "Efectivo"
const mostrarCambio = (select) => {
    const inputCambio = document.getElementById("input-cambio");
    if (select.value === "efectivo") {
        inputCambio.style.display = "block";
    } else {
        inputCambio.style.display = "none";
    }
};

//logica para almacenar los productos en el carrtio 
//inicializo un array para guardar los productos hay 
let carrito = []

    //imprimo los productos en el carrito


    const actualizarInterfazCarrito=()=>{
        //obtengo el mail del carrito
        const carritoMain = document.querySelector(".carrito-main")
        carritoMain.innerHTML = ''

        // Inicializa la variable total fuera del bucle
        let total = 0;

        if(carrito.length <1){
            const parrafo =document.createElement("p")
            parrafo.classList.add("carrito-mensaje")
            parrafo.textContent = "Aun no tienes productos en el carrito..."
            carritoMain.appendChild(parrafo)


        }
        else{
            carrito.forEach((producto,index)=>{
                //creo el contenedor del carrito
                const article = document.createElement("article")
                article.classList.add("carrito-producto")
        
                const fotoProducto = document.createElement("img")
                fotoProducto.src = producto.foto
                fotoProducto.alt = producto.descripcion
                fotoProducto.loading = "lazy";
        
                fotoProducto.classList.add("carrito-producto_foto")
        
                const productoDetallesCon = document.createElement("div")
                productoDetallesCon.classList.add("carrito-producto_detalles")
        
        
                const spanNombre = document.createElement("span")
                spanNombre.textContent = producto.nombre
                spanNombre.classList.add("carrito-producto_nombre")
        
                const spanPrecio = document.createElement("span")
                const precio = formatNumberWithDots(producto.precio);
                spanPrecio.textContent = "$"+precio; 
                spanPrecio.classList.add("carrito-producto_precio")
        
                const carritoProductoControl = document.createElement("div")
                carritoProductoControl.classList.add("carrito-producto_control")
        
                const btnQuitarProducto = document.createElement("button")
                btnQuitarProducto.textContent = 'Quitar'
                btnQuitarProducto.classList.add("carrito-boton")
                btnQuitarProducto.addEventListener("click",()=> quitarProducto(index))
        
                const carritoProductoBotonesControl = document.createElement("div")
                carritoProductoBotonesControl.classList.add("carrito-producto_botonesCan")
        
                //botones de subir y bajar catidad del carrtio
                const btnSubirCan = document.createElement("button")
                btnSubirCan.textContent = '+'
                btnSubirCan.classList.add("carrito-btnSubirCan","carrito-boton")
                btnSubirCan.addEventListener("click", () => agregarCantidad(index))
        
                const btnBajarCan = document.createElement("button")
                btnBajarCan.textContent = '-'
                btnBajarCan.classList.add("carrito-btnBajarCan", "carrito-boton")
                btnBajarCan.addEventListener("click",() => restarCantidad(index))
        
                //para mostrar la cantidad de los productos en el carrito
                const productoCan = document.createElement("span")
                productoCan.textContent = producto.cantidad
                productoCan.classList.add("productoCan")
    
                // Acumula los precios en la variable total
                total += producto.precio * producto.cantidad;
                const carritoTotal = document.getElementById("carrito-total")
                let precioTotal = formatNumberWithDots(total);
                carritoTotal.textContent = `Total: $${precioTotal}`
        
                carritoMain.appendChild(article)
        
                article.appendChild(fotoProducto)
                article.appendChild(productoDetallesCon)
        
                productoDetallesCon.appendChild(spanNombre)
                productoDetallesCon.appendChild(spanPrecio)
        
                article.appendChild(carritoProductoControl)
        
                carritoProductoControl.appendChild(btnQuitarProducto)
                carritoProductoControl.appendChild(carritoProductoBotonesControl)
        
                carritoProductoBotonesControl.appendChild(btnBajarCan)
                carritoProductoBotonesControl.appendChild(productoCan)
                carritoProductoBotonesControl.appendChild(btnSubirCan)
            })
        }
        mostrarCarrito()
    }




    // Función para quitar un producto del carrito
    function quitarProducto(index) {
        carrito.splice(index, 1);
        actualizarInterfazCarrito();
    
        // Oculta el contenedor solo si el carrito está vacío

        if (carrito.length === 0) {
            ocultarCarrito()
            const carritoTotal = document.getElementById("carrito-total")
            carritoTotal.textContent = `Total: 0`

        }
    }
    
    // Función para agregar cantidad a un producto del carrito
    function agregarCantidad(index) {
        carrito[index].cantidad++;
        actualizarInterfazCarrito();
    }
    
    // Función para restar cantidad a un producto del carrito
    function restarCantidad(index) {
        if (carrito[index].cantidad > 1) {
            carrito[index].cantidad--;
        } else {
            // Si la cantidad es 1, se quita el producto del carrito
            carrito.splice(index, 1);
        }
        actualizarInterfazCarrito();
    
    }



//boton de agregar al carrito
const botonGregarCarrito = document.querySelector(".boton-gregar_carrito")
botonGregarCarrito.addEventListener("click",function(){

    //producto a agregar al carrito
    const producto = {
        nombre:botonGregarCarrito.dataset.nombre,
        precio:botonGregarCarrito.dataset.precio,
        foto:botonGregarCarrito.dataset.foto,
        descripcion:botonGregarCarrito.dataset.descripcion,
        cantidad:botonGregarCarrito.dataset.cantidad
    }
    //se compara aver si ya esta en el carrito
    const productoExistente = carrito.find((item) => item.nombre === producto.nombre);

    //si existe solo aumento la cantidad
  if (productoExistente) {
    // Si el producto ya está en el carrito, actualiza la cantidad
    productoExistente.cantidad = parseInt(productoExistente.cantidad) + parseInt(producto.cantidad);

  } else {
    // Si el producto no está en el carrito, agrégalo
    const productoSeleccionado = {
        nombre:producto.nombre,
        precio:producto.precio,
        foto:producto.foto,
        descripcion:producto.descripcion,
        cantidad:producto.cantidad
      // Puedes agregar más propiedades según sea necesario
    };
    //sino existe lo agrego al carrito
    carrito.push(productoSeleccionado);
  }
    //cierro la ventana modal del producto
    cerrarVentanaProductoFocus()
    //agrego los datos al carrito

        //actulizo el carrito
        actualizarInterfazCarrito()
})


//logica del carrito para comprar
//boton del carrito
const  carritoBotonComprar = document.querySelector(".boton_comprar")
carritoBotonComprar.addEventListener("click",function(){
    if (carrito.length >= 1){
        mostrarFormCarrito()
        console.log(carrito);
    }
})

// Función para obtener los datos del formulario
const obtenerDatosFormulario = () => {
    const nombre = document.getElementById('clienteNombre').value;
    const telefono = document.getElementById('clienteCel').value;
    const direccion = document.getElementById("clienteDireccion").value;
    const barrio = document.getElementById("clienteBarrio").value;
    const referencia = document.getElementById("clienteReferencia").value;
    const metodoPago = document.getElementById("select-pago").value;
    const conCuanto = document.getElementById("input-cambio").value;
    const nota = document.getElementById("clienteNota").value;

    return { nombre, telefono, direccion, barrio, referencia, metodoPago, conCuanto, nota };
};

// Función para generar el mensaje de WhatsApp
const generarMensajeWhatsApp = (datosCliente, productos) => {
    let mensaje = `Hola, soy ${datosCliente.nombre || 'Cliente'}. Quisiera realizar un pedido:\n\n`;

    mensaje += `Datos del cliente:\n`;
    mensaje += `Teléfono: ${datosCliente.telefono}\n`;
    if (datosCliente.direccion) {
        mensaje += `Dirección: ${datosCliente.direccion}\n`;
        mensaje += `Barrio o sector: ${datosCliente.barrio}\n`;
        mensaje += `Referencia adicional: ${datosCliente.referencia}\n`;
    }
    mensaje += `Método de pago: ${datosCliente.metodoPago}\n`;
    if (datosCliente.metodoPago === 'efectivo' && datosCliente.conCuanto) {
        mensaje += `Con cuánto va a pagar: ${datosCliente.conCuanto.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}\n`;
    }
    if (datosCliente.nota) {
        mensaje += `Nota: ${datosCliente.nota}\n`;
    }
    mensaje += `\nProductos:\n`;
    productos.forEach(producto => {
        mensaje += `- ${producto.nombre} (Cantidad: ${producto.cantidad}, Precio: ${producto.precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")})\n`;
    });

    return mensaje;
};

// Función para abrir WhatsApp con el mensaje generado
const enviarPorWhatsApp = () => {
    const datosCliente = obtenerDatosFormulario();
    const mensaje = generarMensajeWhatsApp(datosCliente, carrito);
    console.log(datosCliente)
    const telefonoNegocio = document.getElementById("telefono-negocio").textContent
    const url = `https://wa.me/${telefonoNegocio}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
};

const btnPedir = document.getElementById("btnPedir").addEventListener("click",()=>{
    enviarPorWhatsApp()
})

