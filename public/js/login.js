//funcion para mostrar el progress bar
//el parametro es el identidicador de donde voy a rembplazar por el progressbar 
const mostrarProgressBar =(contenedor)=>{
    const progressBar = document.querySelector(".progessBar-container")
    progressBar.style.display = "block"

    contenedor.style.display = "none"
}
//funcion para ocultar el progresbar
const ocultarProgressBar =(contenedor)=>{
    const progressBar = document.querySelector(".progessBar-container")
    progressBar.style.display = "none"

    contenedor.style.display = "block"
}

const bntIngresar = document.querySelector(".boton_enviar")
bntIngresar.addEventListener("click",function(){

    // contenedor de imprimir 
    const imprimirMen = document.getElementById('imprimirMen')
    imprimirMen.textContent = " "
    
    mostrarProgressBar(bntIngresar)

    //obtengo el formulario
    const formContainer = document.getElementById("formContainer")
    var formDataObject = {};
    const formData = new FormData(formContainer);
    formData.forEach(function(value,key){
        formDataObject[key] = value;
    });

    //convierto los datos a json
    let jsonData = JSON.stringify(formDataObject);    
    enviarLosDatos(jsonData)
}
)

const enviarLosDatos = (jsonData)=>{
    //enio los datos al servidor
    fetch('/login.html', {
        method: 'POST',
        headers:{'Content-Type' : 'application/json'},
        body: jsonData
    }) 
    .then(response =>{
        if(!response.ok){
            console.error('Error al iniciar sesion', response.status)
            return response.json()
        }
        else{
            console.log("inicio de sesio exitoso",response.status)
            return response.json()
        }
    })
    .then(data =>{
        if(data.error == 1){
            //destaco el parrafo de olvido su contraseña 
            const enlaceOlvContra = document.getElementById('btn-olvContra')
            enlaceOlvContra.style.color = 'var(--color-dos)'
        }else if(data.error == 2){
            //destaco el parrafo de crear cuenta en caso de que no exita
            crearCuenta = document.querySelector('.crear-cuenta')
            crearCuenta.style.color = "var(--color-dos)"
        }else{
            setTimeout(() => {
                window.location.href = `/panel.html/${data.data}/`;
                setTimeout(()=>{
                    //oculto el progressbar
                    ocultarProgressBar(bntIngresar)},2000)
            }, 1000);
            return
        }
        imprimirMen.textContent = data.mensaje
        imprimirMen.style.color = "var(--color-cuatro)"
        ocultarProgressBar(bntIngresar)
    })
    .catch(err =>{
        //oculto el progressbar
        ocultarProgressBar(bntIngresar)
        //en caso de error lo vuelvo a intentar
        console.error('Error: ' , err)
        //imprimo que hubo un error
        const imprimirMen = document.getElementById('imprimirMen')
        imprimirMen.textContent = 'ocurrio un error, vuelva a intentarlo'
        imprimirMen.style.color = "red" 
    })
}
// Selección de elementos
const formContainerIngresar = document.getElementById("formContainer");
const formContainerOlvContra = document.getElementById("formContainerOlvContra");
const btnOlvContra = document.getElementById("btn-olvContra");
const imprimirMen = document.getElementById('imprimirMen');
const btnEnviarCorreo = document.getElementById("btnEnviarCorreo");

// Inicialización
imprimirMen.textContent = "";

// Mostrar u ocultar secciones de formulario
const mostrarOlvContraseñaSeccion = () => {
    const ingreCorreo = document.getElementById("userEmail").value;
    formContainerIngresar.style.display = "none";
    formContainerOlvContra.style.display = "flex";
    bntIngresar.style.display = "none";

    if (btnOlvContra.textContent === "Ingresar") {
        btnOlvContra.textContent = "¿Olvidaste tu contraseña?";
        formContainerIngresar.style.display = "flex";
        formContainerOlvContra.style.display = "none";
        bntIngresar.style.display = "block";
    } else {
        btnOlvContra.textContent = "Ingresar";
    }

    document.getElementById("inputOlvContra").value = ingreCorreo;
    imprimirMen.textContent = "";
};

// Event listeners
btnOlvContra.addEventListener("click", mostrarOlvContraseñaSeccion);

formContainerOlvContra.addEventListener("submit", (e) => {
    e.preventDefault();
    const correo = document.getElementById("inputOlvContra").value;
    verificarUsuario(correo);
    mostrarProgressBar(btnOlvContra);
    imprimirMen.textContent = "";
});

// Función para verificar el usuario
const verificarUsuario = (correo2) => {
    fetch("/login.html/verificar/cambiarContra", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: correo2 })
    })
    .then(response => {
        if (!response.ok) {
            console.error("El correo no existe");
        }
        return response.json();

    })
    .then(data => {
        imprimirMen.textContent = data.mensaje;
        ocultarProgressBar(btnOlvContra);
    })
    .catch(err => {
        console.error("Error al intentar verificar si el correo existe", err);
        imprimirMen.textContent = "Ocurrió un error";
        setTimeout(() => { location.reload(); }, 3000);
        ocultarProgressBar(btnOlvContra);
    });
};
