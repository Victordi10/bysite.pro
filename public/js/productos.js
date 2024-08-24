// input
const buscador = document.getElementById("buscador");
// boton de buscar
const btnBuscar = document.getElementById("btnBuscar");

// contenedor de resultado
const resultadosContainer = document.querySelector(".resultados-container");
buscador.addEventListener("click", () => {
    btnBuscar.style.display = "block";
});

// Cerrar los resultados al hacer clic fuera del contenedor de resultados
const buscador_container = document.querySelector(".buscador_container");
window.addEventListener("click", (event) => {
    if (!buscador_container.contains(event.target)) {
        ocultarBuscador();
    }
});

// boton de cerrar el buscador
document.getElementById("btn_cerrarBuscador").addEventListener("click", () => {
    ocultarBuscador();
});

const ocultarBuscador = () => {
    const resultadoContainer = document.getElementById("resultado_buscador");
    resultadoContainer.innerHTML = ""; // Vaciar el contenedor antes de empezar a agregar productos
    resultadosContainer.classList.remove("mostrarResultadoSBuscador");
    btnBuscar.style.display = "none";
    buscador.value = "";
}

const progessBar_buscador = document.querySelector(".progessBar_buscador");
btnBuscar.addEventListener("click", async () => {
    progessBar_buscador.style.display = "block";

    let buscarParams = buscador.value;
    const resultadoContainer = document.getElementById("resultado_buscador");
    resultadoContainer.innerHTML = ""; // Vaciar el contenedor antes de empezar a agregar productos

    let imprimirBuscadorMensaje = resultadoContainer.querySelector(".imprimirBuscadorMensaje");

    if (!imprimirBuscadorMensaje) {
        imprimirBuscadorMensaje = document.createElement("p");
        imprimirBuscadorMensaje.classList.add("imprimirBuscadorMensaje");
        resultadoContainer.appendChild(imprimirBuscadorMensaje);
    }

    imprimirBuscadorMensaje.textContent = ""; // Limpia cualquier mensaje anterior

    try {
        const datos = await verificarSesion(()=>{buscar(buscarParams)});
        console.log(datos);
        imprimirResultados(datos);
    } catch (error) {
        console.error("Error al buscar:", error);
        imprimirBuscadorMensaje.textContent = error.message;
    } finally {
        resultadosContainer.classList.add("mostrarResultadoSBuscador");
        progessBar_buscador.style.display = "none";
    }
});

const buscar = async (buscarParams) => {
    try {
        const id_unico_dueno = document.getElementById("id_unico_dueno").value;
        const negocioNombre = document.getElementById("negocioNombre").value;
        const idNegocio = document.getElementById("negocio_id").value;

        const url = `/${id_unico_dueno}/${negocioNombre}/${idNegocio}/buscador?parametro=${encodeURIComponent(buscarParams)}`;
        const response = await fetch(url);

        if (response.status === 404) {
            throw new Error('No se encontraron artículos');
        }

        if (!response.ok) {
            throw new Error(`Error al buscar los datos: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};


//logica para crear los contenedores de categorias
// Función para llamar a los productos y categorías del negocio
const llamarProductosYCategorias = async () => {
    const id_unico_dueno = document.getElementById("id_unico_dueno").value;
    const negocioNombre = document.getElementById("negocioNombre").value;
    const idNegocios = document.getElementById("negocio_id").value;

    try {
        mostrarProgressBar()
        const response = await fetch(`/${idNegocios}/${id_unico_dueno}/${negocioNombre}/productos`);
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al cargar los productos del negocio:", error);
        throw error; // Propaga el error para que se maneje en el contexto de llamada
    }
};


//contenedor de las categorias
const limpiarContenedor = ()=>{
    const inventarioContainerCategorias = document.querySelector(".inventario-container__categorias")
    inventarioContainerCategorias.innerHTML = " "
    //contenedor select de categorias
    const selectCategorias = document.getElementById("selectCategorias")
    selectCategorias.innerHTML = " "

    const articulosForCategoria = document.getElementById("articulosForCategoria");
    articulosForCategoria.innerHTML = " "
}
//variable para conteo de veces que se llama la funcion
let conteo 
const obtenerProductos = async () => {
    try {
        const datos = await verificarSesion(llamarProductosYCategorias);
        
        imprimirCategorias(datos.categorias);
        imprimirProductos(datos.productos);
        configurarEventos(datos);
        estadisticas(datos.productos);

        

        ocultarProgressBar();
    } catch (error) {
        mostrarModalMensajes("error al cargar los productos y categorías intentelo de nuevo")
        console.error("Error al cargar los productos y categorías:", error);
        setTimeout(()=>{
            cerrarSesion()
            },1000)
    }
};

//logica de las estadisticas
const estadisticas =(productos)=>{
    const objProdu = Object.keys(productos).length;
    const btnCreaCategoria = document.querySelector(".inventario-header__btnAgregarCategoria");
    let productoLimit = 10

    const suscripcion = document.getElementById("suscripcion").value
    let imprimirSuscripcion = document.getElementById("imprimir-Suscripcion")
    if(suscripcion == 2){
        productoLimit = 50
        imprimirSuscripcion.textContent = "Basico"
    }else if(suscripcion == 3){
        productoLimit = 140
        imprimirSuscripcion.textContent = "Emprendedor"
    }else if(suscripcion == 4){
        productoLimit = 300
        imprimirSuscripcion.textContent = "Empresario"
    }else{
        productoLimit = 10
        imprimirSuscripcion.textContent = "Prueba"
    }
    const categorias = document.querySelectorAll(".categoria-container").length
    document.getElementById("imprimir-categorías").textContent = categorias - 1
    document.getElementById("imprimir-can_productos").textContent = `${objProdu}/${productoLimit}`;
}



//logica para eliminar productos
const preguntaContainer = document.querySelector(".main-pregunta_container")
// Función para mostrar confirmacion de eliminar
const mostrarPreguntaEliminacion = () => {
    preguntaContainer.classList.add("mostrarPregunta");
    document.body.classList.add("no-scroll");
    preguntaContainer.scrollIntoView();
};

// Función para ocultar el formulario
const ocultarPreguntaEliminacion = () => {
    preguntaContainer.classList.remove("mostrarPregunta");
    document.body.classList.remove("no-scroll");
};

//creo funcion para eliminar negocio
// Obtener los datos del negocio una vez que el DOM esté cargado


//funcion que elimina el negocio
const borrarProducto = (productoNombre,producto_id)=>{
    const id_unico_dueno = document.getElementById("id_unico_dueno").value;
    const negocioNombre = document.getElementById("negocioNombre").value;
    const idNegocios = document.getElementById("negocio_id").value;
    mostrarProgressBar()
    fetch(`/${idNegocios}/${id_unico_dueno}/${negocioNombre}/${productoNombre}/${producto_id}/eliminar`,{
        method: 'DELETE'
    })
    .then(response =>{
    ocultarProgressBar()
    limpiarContenedor
        if(!response.ok){
            console.error("no se elimino el producto correctamente")
        }else{
            mostrarModalMensajes("producto eliminado")     

            limpiarContenedor()
            setTimeout(llamarFunciones_CRUD(), 500);         
        }
    })
    .catch(err=>{
        console.error("error: " , err)
        mostrarModalMensajes("Error al eliminar el producto")     
        ocultarProgressBar()
    })
  }


// Función para mostrar el formulario
const mostrarSeccionFormulario = (contenedor) => {
    contenedor.classList.add("mostrarFormulario");
    document.body.classList.add("no-scroll");
    contenedor.scrollIntoView();
    // Obtener y esconder el header al abrir el formulario
    const aside = document.querySelector(".aside-container");
    aside.style.display = "none";
};

// Función para ocultar el formulario
const ocultarSecionFormulario = (contenedor, clearInputs = true, imagen = false) => {
    contenedor.classList.remove("mostrarFormulario");
    document.body.classList.remove("no-scroll");

    if (clearInputs) {
        // Borrar los valores de los inputs al cerrar el formulario solo si es necesario
        const inputs = document.querySelectorAll(".input",".archivo_input");
        inputs.forEach(input => {
            if (input.type === "file") {
                input.value = ""; // Establecer a cadena vacía para inputs de tipo file
                
            } else {
                input.value = ""; // Establecer a cadena vacía para otros inputs
            }
        });

    if(imagen){
        noHayImagen()
    }
        
    }

    // Mostrar el header de la página nuevamente
    const aside = document.querySelector(".aside-container");
    aside.style.display = "block";
};


//logica para agregar productos
//funcion para verificar la cantidad de productos
const verificarCanProductos = async ()=>{
    try {
           // Obtener los valores de identificación para los parámetros
          const id_unico_dueno = document.getElementById("id_unico_dueno").value;
          const negocioNombre = document.getElementById("negocioNombre").value;
          const idNegocios = document.getElementById("negocio_id").value;
       
          mostrarProgressBar()
       
          const response = await fetch(`/${idNegocios}/${id_unico_dueno}/${negocioNombre}/verificarCan-productos`)
       
          if(!response.ok){
           if(response.status == 403){
               ocultarProgressBar();
               mostrarModalMensajes("Ha alcanzado el máximo de productos permitidos"); // Mostrar el modal con el mensaje de error
           }
          }else{
           ocultarProgressBar();
           mostrarSeccionFormulario(seccionFormularioAgregar)
       
          }
       } catch (error) {
           console.error('Error en la solicitud: ', error);
           mostrarModalMensajes("Error al verificar la cantidad de  producto"); // Mostrar el modal con el mensaje de error
           ocultarProgressBar();
       }
}

//obtengo la seccion de formulario
const seccionFormularioAgregar = document.querySelector("#seccionFormularioAgregar")
//obtengo el boton de para abrir el form de crear productos
const inventarioHeader__btnAgregar = document.querySelector(".inventario-header__btnAgregar")
inventarioHeader__btnAgregar.addEventListener("click",function(){
    verificarSesion(verificarCanProductos)
})

//boton X para cerrar el formulario de agregar
const formularioBtnCerrar_Agregar = document.querySelector("#formularioBtnCerrar_Agregar");
formularioBtnCerrar_Agregar.addEventListener("click",function(){
    ocultarSecionFormulario(seccionFormularioAgregar,true)
})


//logica para poner la imagen encima del input
//contenedor para ver la imagen en el formulario de agregar
const productoFoto = document.getElementById("productoFoto")
productoFoto.addEventListener("change",function(){
    const label2 = document.getElementById('labelArchivoAgregar')
    const file = this.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = function(event){
            const imagenUrl = event.target.result;
            label2.innerHTML = `<img src='${imagenUrl}' class="mostrarImagen_archivo">`
        }
        reader.readAsDataURL(file)
    }
    else{
        noHayImagen()
    }
})

//variable contadora para manejar errores
/* let count = 0 */

//funcion para agregar productos
const agregarProducto = () => {
    // Obtener los valores de identificación para los parámetros
    const id_unico_dueno = document.getElementById("id_unico_dueno").value;
    const negocioNombre = document.getElementById("negocioNombre").value;
    const idNegocios = document.getElementById("negocio_id").value;
    // Obtener el nombre del producto
    const productoNombre = document.getElementById("productoNombre").value.trim();

    // Obtener el contenedor del formulario
    const formContainer_agregar = document.querySelector("#formContainer_agregar");
    const formData = new FormData(formContainer_agregar);

    // Intentar evitar que se envíe sin letras
    if (productoNombre === "") {
        mostrarModalMensajes("El producto no tiene nombre"); // Mostrar el modal con el mensaje de error
    } else {
        mostrarProgressBar();
        fetch(`/${idNegocios}/${id_unico_dueno}/${negocioNombre}/${productoNombre}/agregar`, {
            method: 'POST',
            body: formData 
        })
        .then(res => {
            ocultarSecionFormulario(seccionFormularioAgregar,true,true);
            ocultarProgressBar();
            if (res.ok) {
                mostrarModalMensajes("Producto guardado"); // Mostrar el modal con el mensaje de éxito
                limpiarContenedor();
                setTimeout(() => {
                    mostrarProgressBar();
                    llamarFunciones_CRUD();
                    ocultarProgressBar();
                }, 500);
            } else {
                if (res.status === 401) {
                    contenedorMensaje.textContent = "Ya existe un producto con el mismo nombre";
                }else if (res.status === 403) {
                    contenedorMensaje.textContent = "Haz alcanzado el máximo de productos permitidos";
                    btnMenModal.style.display = "inline-block"
                }else {
                    console.error("Error en la solicitud: ", res.status);
                }
                mostrarModalMensajes("El producto no se creó"); // Mostrar el modal con el mensaje de error
            }
        })
        .catch(err => {
            console.error('Error en la solicitud: ', err);
            mostrarModalMensajes("Error al crear el producto"); // Mostrar el modal con el mensaje de error
            ocultarProgressBar();
        });
    }
}
// Botón de guardar producto del formulario
const formBtnGuardar_Agregar = document.querySelector("#formBtnGuardar_Agregar");
formBtnGuardar_Agregar.addEventListener("click",()=>{verificarSesion(agregarProducto)});



// Lógica para actualizar productos
// Formulario contenedor actualizar
const seccionFormularioInfo = document.querySelector("#seccionFormularioInfo");
// Botón de cerrar el formulario de actualizar la info del producto
document.querySelector("#formularioBtnCerrar_Info").addEventListener("click", function() {
    ocultarSecionFormulario(seccionFormularioInfo);
});

// Función de solicitud para actualizar los detalles del producto
const actualizarDetalles = (productoNombre, datos) => {
    const productoNombreActualizar = document.querySelector("#productoNombreActualizar")
    const nombreRecortado = productoNombreActualizar.value.trim(); // Eliminar espacios en blanco al inicio y al final

    if (nombreRecortado === "") {
        mostrarModalMensajes("El producto no tiene nombre"); // Mostrar el modal con el mensaje de error
        return; // Detener la ejecución si el nombre está vacío
    } else {
        const id_unico_dueno = document.getElementById("id_unico_dueno").value;
        const negocioNombre = document.getElementById("negocioNombre").value;
        const idNegocios = document.getElementById("negocio_id").value;
        mostrarProgressBar();
        fetch(`/${idNegocios}/${id_unico_dueno}/${negocioNombre}/${productoNombre}/editarDetalles`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            })
            .then(response => {
                ocultarProgressBar();
                ocultarSecionFormulario(seccionFormularioInfo);
                if (!response.ok) {
                    console.error("Error al actualizar los datos", response.status);
                }
                return response.json()
            })
            .then(data=>{
                console.log(data)
                mostrarModalMensajes(data.mensaje);
                const dataDe = data.detalles
                console.log(dataDe)

                cambiarProductoDetalles(datos.productoId,dataDe.nom,dataDe.des,dataDe.precio)

            })
            .catch(err => {
                console.error("Error:", err);
                mostrarModalMensajes("Error al actualizar el producto");
            });
    }
};


//seccion formulario de actualizar archivo
const seccionFormularioArchivo = document.querySelector("#seccionFormularioArchivo")
 //boton de cerrar el formulario de actualizar archivo de producto
document.querySelector("#formularioBtnCerrar_Archivo").addEventListener("click",function(){
    ocultarSecionFormulario(seccionFormularioArchivo,true,true)
}) 

const actualizarFotoProducto = (productoNombre, productoID, idImg) => {
    const formContainer_archivo = document.getElementById("formContainer_archivo");
    const formData = new FormData(formContainer_archivo);
    
    const idNegocios = document.getElementById("negocio_id").value;
    const id_unico_dueno = document.getElementById("id_unico_dueno").value;
    const negocioNombre = document.getElementById("negocioNombre").value;
    mostrarProgressBar();
    fetch(`/${idNegocios}/${id_unico_dueno}/${negocioNombre}/${productoNombre}/editarFoto?productoID=${productoID}`, {
        method: 'PUT',
        body: formData
    })
    .then(response => {
        ocultarSecionFormulario(seccionFormularioArchivo,true,true);
        ocultarProgressBar();
        if (!response.ok) {
            console.error("No se actualizó la foto");
        }
        return response.json();
    })
    .then(data => {
        mostrarModalMensajes(data.mensaje);
        console.log(data.src);
        console.log(idImg);
        cambiarFoto(idImg, data.src, productoID);
    })
    .catch(err => {
        console.error("Error:", err);
        mostrarModalMensajes("Error al actualizar la foto");
    });
};

const actualizarArchivo = (callback, ...args) => {
    
    // Evento de si hay cambios para enviar la solicitud
    const actualizarArchivo_input = document.getElementById("actualizarArchivo_input");

    // Eliminar event listener previo si existe
    actualizarArchivo_input.removeEventListener("change", actualizarArchivo_input._handleChange);

    // Definir el nuevo event listener
    const handleChange = function(e) {
        e.stopPropagation();

        const label = document.getElementById('actualizarLabel_label')
                const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const imagenUrl = event.target.result;
                label.innerHTML = `<img src='${(imagenUrl ? imagenUrl : "../../../img/añadir.png")}' class="mostrarImagen_archivo">`
            }
            reader.readAsDataURL(file);
        } else {
            label.innerHTML = `<img src="../../../img/añadir.png"}`;
        }

        // Obtengo el botón de guardar y lo muestro
        const formBtnGuardar_Archivo = document.querySelector("#formBtnGuardar_Archivo");
        formBtnGuardar_Archivo.style.display = "inline-block";

        // Eliminar event listener previo si existe
        formBtnGuardar_Archivo.removeEventListener("click", formBtnGuardar_Archivo._handleSave);

        // Definir el nuevo event listener
        const handleSave = function() {
            callback(...args);
            ocultarSecionFormulario(seccionFormularioArchivo,true,true);
            noHayImagen()
        }

        // Asignar el nuevo event listener
        formBtnGuardar_Archivo._handleSave = handleSave;
        formBtnGuardar_Archivo.addEventListener("click", handleSave);
    };

    // Asignar el nuevo event listener
    actualizarArchivo_input._handleChange = handleChange;
    actualizarArchivo_input.addEventListener("change", handleChange);
}
//funcion para llamar alas funciones sin recargar la pagina
const llamarFunciones_CRUD=()=>{
    obtenerProductos()
}
//llamo a la funcion al cargar la pagina
document.addEventListener("DOMContentLoaded", function() {
    llamarFunciones_CRUD()
});
/* //boton de refrescar los productos
const btnInventarioRefresh = document.querySelector(".btn-inventarioRefresh").addEventListener("click",()=>{
    limpiarContenedor()
    setTimeout(()=>{llamarFunciones_CRUD()},500)
})  */
