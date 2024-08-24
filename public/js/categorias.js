const mostrarListaCategorias = () => {
  const listaCategorias = document.getElementById("listaCategorias");
  listaCategorias.style.display = "flex";
  document.getElementById("btnOpenCategorias").textContent = "Cerrar";
}

const ocultarListaCategorias = () => {
  const listaCategorias = document.getElementById("listaCategorias");
  listaCategorias.style.display = "none";
  document.getElementById("btnOpenCategorias").textContent = "Categorías";
}

document.getElementById("btnOpenCategorias").addEventListener("click", (e) => {
  e.stopPropagation(); // Evita que el clic se propague al documento
  const listaCategorias = document.getElementById("listaCategorias");

  // Alternar entre mostrar y ocultar la lista de categorías
  if (listaCategorias.style.display === "flex") {
    ocultarListaCategorias();
  } else {
    mostrarListaCategorias();
  }
});

window.addEventListener("load", ocultarListaCategorias);

document.addEventListener("click", (e) => {
  const listaCategorias = document.getElementById("listaCategorias");
  const btnOpenCategorias = document.getElementById("btnOpenCategorias");
  
  // Verifica si el clic fue fuera de la lista de categorías y el botón
  if (!listaCategorias.contains(e.target) && e.target !== btnOpenCategorias) {
    ocultarListaCategorias();
  }
});


// Función para imprimir las categorías en el seleccion
const imprimirCategorias = (categorias) => {
  const inventarioCategoriasContainer = document.querySelector(".inventario-container__categorias");

  // Crear y agregar el contenedor "sinCategorias" al DOM al final
  const sinCategoriasContainer = document.createElement("section");
  sinCategoriasContainer.classList.add("categoria-container");
  sinCategoriasContainer.id = "sinCategoria";

  const tituloSinCategoria = document.createElement("h2");
  tituloSinCategoria.classList.add("categoria-nombre");
  tituloSinCategoria.textContent = "sinCategoria";

  const sinCategoriaProductosContainer = document.createElement("div");
  sinCategoriaProductosContainer.classList.add("categoriaProductosContainer");

  sinCategoriasContainer.appendChild(tituloSinCategoria);
  sinCategoriasContainer.appendChild(sinCategoriaProductosContainer);

  let hasSinCategoriaProducts = false;

  categorias.forEach(categoria => {
      let nombreCategoria = categoria.categoria ? categoria.categoria.replace(/\s+/g, '_') : "sinCategoria";

      // Si la categoría es "sinCategoria", agregar productos sin categoría
      if (nombreCategoria === "sinCategoria") {
          hasSinCategoriaProducts = true;
          // Aquí agregas productos sin categoría a sinCategoriaProductosContainer
          // Ejemplo: sinCategoriaProductosContainer.appendChild(productoElemento);
          return;  // Saltar la creación del contenedor "sinCategoria" nuevamente
      }

      const conCategoria = document.createElement("section");
      conCategoria.classList.add("categoria-container");
      conCategoria.id = nombreCategoria;

      const tituloCategoria = document.createElement("h2");
      tituloCategoria.classList.add("categoria-nombre");
      tituloCategoria.textContent = nombreCategoria.replace(/_/g, ' ');

      const categoriaProductosContainer = document.createElement("div");
      categoriaProductosContainer.classList.add("categoriaProductosContainer");

      inventarioCategoriasContainer.appendChild(conCategoria);
      conCategoria.appendChild(tituloCategoria);
      conCategoria.appendChild(categoriaProductosContainer);

      // Imprimir las categorías en el menú de categorías
      const categoriasContainer = document.getElementById("selectCategorias");
      const li_categoria = document.createElement("li");
      li_categoria.classList.add("select-opcion", "select-opcion_categora");
      li_categoria.dataset.categoria = nombreCategoria;

      const spanCategoria = document.createElement("span");
      spanCategoria.textContent = nombreCategoria.replace(/_/g, ' ');
      spanCategoria.dataset.categoria = nombreCategoria;

      spanCategoria.addEventListener("click", (e) => {
          e.stopPropagation();
          const ir_categoria = e.target.textContent.replace(/\s+/g, '_');
          document.querySelector(`#${ir_categoria}`).scrollIntoView();
      });

      // Crear el icono de opciones de categorías
      const opcionesCategoria = document.createElement("i");
      opcionesCategoria.classList.add("fas", "fa-ellipsis-v", "categoriaOpciones-boton");

      opcionesCategoria.addEventListener("click", (e) => {
          e.stopPropagation();
          if (contenedorOpcionesAbierto && contenedorOpcionesAbierto !== contenedorOpciones) {
              contenedorOpcionesAbierto.style.display = "none";
          }
          contenedorOpciones.style.display = contenedorOpciones.style.display === "flex" ? "none" : "flex";
          contenedorOpcionesAbierto = contenedorOpciones.style.display === "flex" ? contenedorOpciones : null;
      });

      document.addEventListener("click", (event) => {
          if (contenedorOpcionesAbierto && !contenedorOpcionesAbierto.contains(event.target) && !opcionesCategoria.contains(event.target)) {
              contenedorOpcionesAbierto.style.display = "none";
              contenedorOpcionesAbierto = null;
          }
      });

      // Contenedor de opciones
      const contenedorOpciones = document.createElement("div");
      contenedorOpciones.classList.add("categoria_contenedor__opciones");
      contenedorOpciones.style.display = "none";

      // Lógica de borrar categoría
      const btnBorrarCategoria = document.createElement("button");
      btnBorrarCategoria.classList.add("categoria-boton", "boton_borrarCategoria");
      btnBorrarCategoria.setAttribute("data-nombre", nombreCategoria);
      btnBorrarCategoria.textContent = "Borrar";
      btnBorrarCategoria.addEventListener("click", (e) => {
          e.stopPropagation();
          document.getElementById("contenedorTextoDelete").textContent = "La categoria";
          mostrarPreguntaEliminacion();
          document.querySelector(".pregunta_cancelar").onclick = ocultarPreguntaEliminacion;
          document.querySelector(".pregunta_aceptar").onclick = () => {
              eliminarCategoria(nombreCategoria);
              ocultarPreguntaEliminacion();
          };
          console.log(nombreCategoria);
      });

      // Botón de renombrar categoría
      const btnRenombrarCategoria = document.createElement("button");
      btnRenombrarCategoria.textContent = "renombrar";
      btnRenombrarCategoria.classList.add("categoria-boton", "boton_editarCategoria");
      btnRenombrarCategoria.setAttribute("data-nombre", nombreCategoria);
      btnRenombrarCategoria.addEventListener("click", (e) => {
          e.stopPropagation();
          mostrarSeccionFormulario(seccionFormularioCategorias);
          mostrarbtnRenombrar(nombreCategoria);

          const categoriaInput = document.getElementById("categoriaInput");
          // Eliminar el evento
          categoriaInput.removeEventListener("input", mostrarBotonSiguiente);

          // Botón de renombrar la categoría
          document.getElementById("btn_categoriaRenombrar").addEventListener("click", () => {
              const newCategoria = document.getElementById("categoriaInput").value;
              renombrarCategoria(newCategoria, nombreCategoria);
          });
      });

      const btnEditarCollecion = document.createElement("button");
      btnEditarCollecion.textContent = "Edi. colleccion";
      btnEditarCollecion.classList.add("categoria-boton", "boton_colleccion");
      btnEditarCollecion.setAttribute("data-nombre", nombreCategoria);

      categoriasContainer.appendChild(li_categoria);
      li_categoria.appendChild(spanCategoria);
      if (li_categoria.dataset.categoria !== "sinCategoria") {
          li_categoria.appendChild(opcionesCategoria);
      }
      li_categoria.appendChild(contenedorOpciones);
      contenedorOpciones.appendChild(btnBorrarCategoria);
      contenedorOpciones.appendChild(btnRenombrarCategoria);
      contenedorOpciones.appendChild(btnEditarCollecion);
  });

  // Añadir el contenedor "sinCategorias" al final
  inventarioCategoriasContainer.appendChild(sinCategoriasContainer);

  // Añadir "sinCategoria" al menú de categorías solo si hay productos sin categoría
  const categoriasContainer = document.getElementById("selectCategorias");
  if (hasSinCategoriaProducts) {
      const li_categoria = document.createElement("li");
      li_categoria.classList.add("select-opcion", "select-opcion_categora");
      li_categoria.dataset.categoria = "sinCategoria";

      const spanCategoria = document.createElement("span");
      spanCategoria.textContent = "sinCategoria";
      spanCategoria.dataset.categoria = "sinCategoria";

      spanCategoria.addEventListener("click", (e) => {
          e.stopPropagation();
          document.querySelector(`#sinCategoria`).scrollIntoView();
      });

      li_categoria.appendChild(spanCategoria);
      categoriasContainer.appendChild(li_categoria);
  } else {
      sinCategoriasContainer.style.display = "none";
  }
};


const mostrarbtnRenombrar =(nombreCategoria)=>{
  document.getElementById("btn_categoriaRenombrar").style.display = "inline-block"
  document.getElementById("btn_categoriaSiguiente").style.display = "none"
  document.getElementById("form_tituloCategoria").textContent = "Renombrar " + nombreCategoria
}

const ocultarbtnRenombrar =()=>{
  document.getElementById("btn_categoriaRenombrar").style.display = "none"
  document.getElementById("btn_categoriaSiguiente").style.display = "inline-block"
  document.getElementById("form_tituloCategoria").textContent = "Crear Categoria"
  oldCategoria = ""
}

// Función para ocultar el formulario
const ocultarFormulario = (contenedor) => {
   contenedor.classList.remove("mostrarFormulario");
    document.body.classList.remove("no-scroll");
    //oculto el headder de la pagina
    const aside = document.querySelector(".aside-container")
    aside.style.display = "block"

    const inputs = document.querySelectorAll(".input")
    inputs.forEach(input=>{
        input.value = ""
    })

    ocultarbtnRenombrar()
    document.getElementById("btn_categoriaSiguiente").style.display = "none"
    ocultarSeccionForm_2();
};

// Obtener los elementos del DOM
const seccionFormularioCategorias = document.getElementById("seccionFormularioCategorias");
//el boton de abrir el form esta en negocios.js


// Botón para ocultar el formulario de crear categoría
const btn_categoriaCancelar = document.getElementById("btn_categoriaCancelar");
btn_categoriaCancelar.addEventListener("click", () => {
    ocultarFormulario(seccionFormularioCategorias);

});
const btn_categoriaCerrar = document.getElementById("btn_categoriaCerrar");
btn_categoriaCerrar.addEventListener("click", () => {
  ocultarSeccionForm_2();
});

// Función para mostrar la sección 1 y ocultar la sección 2
const mostrarSeccionForm_1 = () => {
  const seccionFormCategora_1 = document.querySelectorAll(".seccionFormCategora_1");
  seccionFormCategora_1.forEach(seccion1 => {
    seccion1.style.display = "none";
  });
  const seccionFormCategora_2 = document.querySelectorAll(".seccionFormCategora_2");
  seccionFormCategora_2.forEach(seccion2 => {
    seccion2.style.display = "flex";
  });
};

// Función para mostrar la sección 2 y ocultar la sección 1
const ocultarSeccionForm_2 = () => {
  const seccionFormCategora_1 = document.querySelectorAll(".seccionFormCategora_1");
  seccionFormCategora_1.forEach(seccion1 => {
    seccion1.style.display = "flex";
  });
  const seccionFormCategora_2 = document.querySelectorAll(".seccionFormCategora_2");
  seccionFormCategora_2.forEach(seccion2 => {
    seccion2.style.display = "none";
  });
};

// Input de categoría
const categoriaInput = document.getElementById("categoriaInput");

// Botón de siguiente del formulario
const btn_categoriaSiguiente = document.getElementById("btn_categoriaSiguiente");
btn_categoriaSiguiente.style.display = "none";
btn_categoriaSiguiente.addEventListener("click", () => {
  if (categoriaInput.value.trim() === "") {
    categoriaInput.style.border = "1px solid red";
  } else {
    mostrarSeccionForm_1();
  }
});

// Define la función manejadora
function mostrarBotonSiguiente() {
  btn_categoriaSiguiente.style.display = "block";
}
// Añadir el evento
categoriaInput.addEventListener("input", mostrarBotonSiguiente);


const crearProductoCategoria = (producto, seleccionado = false) => {
  const productoContainer = document.createElement("article");
  productoContainer.classList.add("producto-container", "productoSinCate-container");

  const fotoProducto = document.createElement("div");
  fotoProducto.classList.add("producto_foto_container");
  fotoProducto.style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.2)), url("${(producto.producto_logo ? producto.producto_logo : "../../../img/añadir.png")}")`;
  fotoProducto.loading = "lazy";

  const conDetalles = crearDetallesProducto(producto);

  const checkboxContainer = document.createElement("div");
  checkboxContainer.classList.add("checkbox-container");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `checkbox-${producto.id}`;
  checkbox.value = producto.id;
  checkbox.checked = seleccionado; // Marcar o desmarcar el checkbox basado en el parámetro

  // Detener la propagación del evento de clic en el checkbox
  checkbox.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  const label = document.createElement("label");
  label.htmlFor = checkbox.id;
  label.textContent = producto.nombre; // Usar el nombre del producto como etiqueta

  // Detener la propagación del evento de clic en la etiqueta
  label.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  checkboxContainer.appendChild(checkbox);
  checkboxContainer.appendChild(label);

  productoContainer.appendChild(fotoProducto);
  productoContainer.appendChild(conDetalles);
  productoContainer.appendChild(checkboxContainer);

  // Agregar evento al contenedor para manejar la selección
  productoContainer.addEventListener('click', (e) => {
    // Asegurarse de que el clic no proviene del checkbox o la etiqueta
    if (e.target !== checkbox && e.target !== label) {
      checkbox.checked = !checkbox.checked;
      if (checkbox.checked) {
        console.log(`Producto ${producto.id} seleccionado`);
      } else {
        console.log(`Producto ${producto.id} deseleccionado`);
      }
    }
  });

  return productoContainer;
};

const imprimirProductosCate = (productos, categoria, seleccionado = false) => {
  articulosForCategoria.innerHTML = ''; // Limpiar contenedor antes de agregar productos
  productos.forEach(producto => {
      if (categoria ? producto.categoria === categoria : !producto.categoria) {
          console.log(producto);
          const productoContainer = crearProductoCategoria(producto, seleccionado);
          articulosForCategoria.appendChild(productoContainer);
      }
  });
};
const imprimirProductosCateEditar = (productos, categoria, seleccionado = false) => {
  articulosForCategoria.innerHTML = ''; // Limpiar contenedor antes de agregar productos
  productos.forEach(producto => {
      if ( producto.categoria === categoria) {
          console.log(producto);
          const productoContainer = crearProductoCategoria(producto, seleccionado);
          articulosForCategoria.appendChild(productoContainer);
      }
      else if(!producto.categoria){
        console.log(producto);
          const productoContainer = crearProductoCategoria(producto, !seleccionado);
          articulosForCategoria.appendChild(productoContainer);
      }
  });
};



const imprimirProductosCategoriaSellcionada = (productos, categoria) => {
  imprimirProductosCateEditar(productos, categoria, true);
  const btn_categoriaGuardar = document.getElementById("btn_categoriaGuardar");
  btn_categoriaGuardar.dataset.categoria = categoria // Los productos deben aparecer seleccionados
};

const imprimirProductosSinCategoria = (productos) => {
  imprimirProductosCate(productos, null, false); // Los productos no deben aparecer seleccionados
};


const configurarEventos = (datos) => {
  const btnEditarCollecion = document.querySelectorAll(".boton_colleccion");
  btnEditarCollecion.forEach(boton => {
      boton.addEventListener("click", (e) => manejarEdicionCategoria(e, datos.productos));
  });

  const btn_categoriaSiguiente = document.getElementById("btn_categoriaSiguiente");
  btn_categoriaSiguiente.addEventListener("click", () => manejarAgregarCategoria(datos.productos));
  
  let btn_categoriaGuardar = document.getElementById("btn_categoriaGuardar");

  const removeEventListeners = (element, eventType) => {
    const newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);
    return newElement;
  };
  
  btn_categoriaGuardar = removeEventListeners(btn_categoriaGuardar, "click");
  btn_categoriaGuardar.addEventListener("click", () => {
    if (document.getElementById("tituloFormCategoria").textContent === "Editar Colleccion") {
      editarCategoria();
    } else {
      crearCategoria();
    }
  });

};

const manejarEdicionCategoria = (e, productos) => {
  e.stopPropagation();
  mostrarSeccionFormulario(seccionFormularioCategorias);
  mostrarSeccionForm_1();

  const categoriaSellec = e.target.dataset.nombre;
  console.log(categoriaSellec);
  imprimirProductosCategoriaSellcionada(productos, categoriaSellec);

  document.getElementById("tituloFormCategoria").textContent = "Editar Colleccion";
  const btn_categoriaCerrar = document.getElementById("btn_categoriaCerrar");
  btn_categoriaCerrar.addEventListener("click", () => {
      ocultarFormulario(seccionFormularioCategorias);
      ocultarSeccionForm_2();
  });
};


const manejarAgregarCategoria = (productos) => {
  imprimirProductosSinCategoria(productos);

  document.getElementById("tituloFormCategoria").textContent = "Agregar Productos";

  const btn_categoriaCerrar = document.getElementById("btn_categoriaCerrar");
  btn_categoriaCerrar.addEventListener("click", () => {
      ocultarSeccionForm_2();
  });
};


// Función para crear categoría
const crearCategoria = () => {
  const categoria = categoriaInput.value;
  const productosSeleccionados = [];
  
  // Recopilar los ids de los productos seleccionados
  const checkboxes = document.querySelectorAll("#articulosForCategoria input[type='checkbox']:checked");
  checkboxes.forEach(checkbox => {
    productosSeleccionados.push(checkbox.value);
  });

  const datos = {
    categoria: categoria,
    productos: productosSeleccionados
  };
  console.log(datos)

  mostrarProgressBar();

  const negocioNombre = document.getElementById("negocioNombre").value;
  const idNegocios = document.getElementById("negocio_id").value;
  const id_unico_dueno = document.getElementById("id_unico_dueno").value;
  
   fetch(`/${idNegocios}/${negocioNombre}/agregar-categoria?idUnico=${id_unico_dueno}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  })
  .then(res => {
    ocultarFormulario(seccionFormularioCategorias);
    ocultarProgressBar();
    if (res.ok) {
      mostrarModalMensajes("Categoría creada con éxito"); // Mostrar el modal con el mensaje de éxito
      limpiarContenedor();
      setTimeout(() => {
        mostrarProgressBar();
        llamarFunciones_CRUD();
        ocultarProgressBar();
      }, 500);
    } else {
      if (res.status === 401) {
        contenedorMensaje.textContent = "Ya existe una categoría con el mismo nombre";
      }else if(res.status === 403){
        contenedorMensaje.textContent = "No puedes crear categorias, Suscribete";
      }
      else {
        console.error("Error en la solicitud: ", res.status);
      }
      mostrarModalMensajes("Error al crear la categoría"); // Mostrar el modal con el mensaje de error
    }
  })
  .catch(err => {
    console.error('Error en la solicitud: ', err);
    mostrarModalMensajes("Error al crear la categoría"); // Mostrar el modal con el mensaje de error
    ocultarProgressBar();
  }); 
};


const renombrarCategoria =(newCategoria,categoriaOld)=>{
  mostrarProgressBar();
  const datos = {
    new: newCategoria,
    old:categoriaOld

  }
  const negocioNombre = document.getElementById("negocioNombre").value;
  const idNegocios = document.getElementById("negocio_id").value;
  const id_unico_dueno = document.getElementById("id_unico_dueno").value;
  
   fetch(`/${idNegocios}/${negocioNombre}/renombrar-categoria?idUnico=${id_unico_dueno}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  })
  .then(res => {
    ocultarFormulario(seccionFormularioCategorias);
    ocultarProgressBar();
    if (res.ok) {
      mostrarModalMensajes("Categoría renombrada con éxito"); // Mostrar el modal con el mensaje de éxito
      limpiarContenedor();
      setTimeout(() => {
        mostrarProgressBar();
        llamarFunciones_CRUD();
        ocultarProgressBar();
      }, 500);
    } else {
      if (res.status === 401) {
        mostrarModalMensajes( "Ya existe una categoría con el mismo nombre")
      }else if(res.status === 403){
        mostrarModalMensajes( "No puedes crear categorias, Suscribete")
      }
      else {
        console.error("Error en la solicitud: ", res.status);
      }
      mostrarModalMensajes( "Error al crear la categoría"); // Mostrar el modal con el mensaje de error
    }
  })
  .catch(err => {
    console.error('Error en la solicitud: ', err);
    mostrarModalMensajes("Error al renombrar la categoría"); // Mostrar el modal con el mensaje de error
    ocultarProgressBar();
  }); 
}

const eliminarCategoria = (categoria)=>{
  mostrarProgressBar();
  const datos = {
    categoria:categoria
  }
  const negocioNombre = document.getElementById("negocioNombre").value;
  const idNegocios = document.getElementById("negocio_id").value;
  const id_unico_dueno = document.getElementById("id_unico_dueno").value;
  
   fetch(`/${idNegocios}/${negocioNombre}/eliminar-categoria?idUnico=${id_unico_dueno}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  })
  .then(res => {
    ocultarFormulario(seccionFormularioCategorias);
    ocultarProgressBar();
    if (res.ok) {
      mostrarModalMensajes("Categoría eliminada con éxito"); // Mostrar el modal con el mensaje de éxito
      limpiarContenedor();
      setTimeout(() => {
        mostrarProgressBar();
        llamarFunciones_CRUD();
        ocultarProgressBar();
      }, 500);
    } else {
      if(res.status === 400){
       mostrarModalMensajes("No existe la categoria"); // Mostrar el modal con el mensaje de error
      }
      else {
        console.error("Error en la solicitud: ", res.status);
        mostrarModalMensajes("Error al eliminar la categoría")
      }
    }
  })
  .catch(err => {
    console.error('Error en la solicitud: ', err);
    mostrarModalMensajes("Error al eliminar la categoría"); // Mostrar el modal con el mensaje de error
    ocultarProgressBar();
  }); 
}


//logica para editar las colleciones
const editarCategoria = () => {
  const productosSeleccionados = [];
  const productosNoSeleccionados = [];
  
  // Recopilar los ids de los productos seleccionados y no seleccionados
  const checkboxes = document.querySelectorAll("#articulosForCategoria input[type='checkbox']");
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      productosSeleccionados.push(checkbox.value);
    } else {
      productosNoSeleccionados.push(checkbox.value);
    }
  });
  const categoria = document.getElementById("btn_categoriaGuardar").dataset.categoria

  const datos = {
    productosSeleccionados: productosSeleccionados,
    productosNoSeleccionados: productosNoSeleccionados,
    categoria: categoria
  };
  console.log(datos);

  mostrarProgressBar();

  const negocioNombre = document.getElementById("negocioNombre").value;
  const idNegocios = document.getElementById("negocio_id").value;
  const id_unico_dueno = document.getElementById("id_unico_dueno").value;
  
  fetch(`/${idNegocios}/${negocioNombre}/editar-categoria?idUnico=${id_unico_dueno}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  })
  .then(res => {
    ocultarFormulario(seccionFormularioCategorias);
    ocultarProgressBar();
    if (res.ok) {
      mostrarModalMensajes( "Categoría editada con éxito"); // Mostrar el modal con el mensaje de éxito
      limpiarContenedor();
      setTimeout(() => {
        mostrarProgressBar();
        llamarFunciones_CRUD();
        ocultarProgressBar();
      }, 500);
    } else {
      if (res.status === 401) {
        mostrarModalMensajes("Ya existe una categoría con el mismo nombre")
      } else if (res.status === 403) {
        mostrarModalMensajes("No puedes crear categorias, Suscribete")
      } else {
        console.error("Error en la solicitud: ", res.status);
        mostrarModalMensajes("Error al editar la categoría"); // Mostrar el modal con el mensaje de error
    }
    }
  })
  .catch(err => {
    console.error('Error en la solicitud: ', err);
    mostrarModalMensajes("Error al editar la categoría"); // Mostrar el modal con el mensaje de error
    ocultarProgressBar();
  }); 
};


const recomendarProducto = (recomendado, productoID) => {
  const negocioID = document.getElementById("negocio_id").value;
  const accion = recomendado === 1 ? 'recomendar' : 'no-recomendar';

  fetch(`/${accion}/${negocioID}`, {
      method: 'PUT',
      body: JSON.stringify({ productoID }),
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .catch(err => {
      console.error(`Error al ${accion} el producto`, err);
  });
}

const destacarProducto = (destacado, productoID) => {
  const negocioID = document.getElementById("negocio_id").value;
  const accion = destacado === 1 ? 'destacar' : 'no-destacar';

  fetch(`/${accion}/${negocioID}`, {
      method: 'PUT',
      body: JSON.stringify({ productoID }),
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .catch(err => {
      console.error(`Error al ${accion} el producto`, err);
  });
}