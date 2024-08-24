//logica para mostrar la ventana modal de los planes de suscribcion
const seccionPasarela = document.querySelector(".seccion-pasarela")
const mostrarModalSuscribcion=()=>{
  seccionPasarela.classList.add("mostrarOvelayModal")
  document.body.classList.add("no-scroll")
  
  //logica de empezar la pasarela desde de ocultarla
  //muestro los planes
  const seccionPlanes = document.querySelector(".seccion-planes").style.display = 'flex'
  //oculto los formularios de pago
  const formulario_pago = document.querySelector(".formulario_pago").style.display = "none"
}


const ocultarModalSuscribcion=()=>{
  seccionPasarela.classList.remove("mostrarOvelayModal")
document.body.classList.remove("no-scroll")
//borro los valores del input
/* const formInput__pago = document.querySelectorAll(".form-input__pago").forEach(input=>{
  input.value = " "
}) */
}


//boton para mostrar la ventana modal de suscribirse
const suscribirseBtn = document.querySelectorAll(".suscribirse-btn").forEach(boton=>{
  boton.addEventListener("click",mostrarModalSuscribcion)
})
//boton de ocultar la seccion de suscribirse
document.getElementById("btn-planesCerrar").addEventListener("click",ocultarModalSuscribcion)


//logica para hacer scroll con deslizamiento para los planes
let touchStartX = 0;
let touchEndX = 0;
// Escuchar eventos táctiles
document.querySelector('.planes-container').addEventListener('touchstart', handleTouchStart, false);
document.querySelector('.planes-container').addEventListener('touchend', handleTouchEnd, false);
// Función para manejar el inicio del toque
function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
}
// Función para manejar el final del toque
function handleTouchEnd(event) {
  touchEndX = event.changedTouches[0].clientX;
}


window.addEventListener("DOMContentLoaded",()=>{
    //verifico que suscribcion tiene
    const suscripcion = document.getElementById("sucripcion").value 
    const suscribirseParrafo = document.querySelector(".suscribirse-parrafo")

    if(suscripcion > 1){
      const botonPlan = document.getElementById(`plan${suscripcion}`)
      botonPlan.textContent = "Cancelar suscripción"
      botonPlan.style.backgroundColor = "#fff"
      botonPlan.classList.add("btnCancelarPlan")
      botonPlan.style.color = "#000"

      let MAX_plan = suscripcion
      while(MAX_plan < 5){
        console.log("fun")
        if(MAX_plan == 4){
          break
        }
        MAX_plan++
        let botonPlanNext = document.getElementById(`plan${MAX_plan}`)
        botonPlanNext.textContent = "Mejorar plan"
      }

      let MIN_plan = suscripcion
      while(MIN_plan > 2){
        if(MAX_plan == 2){
          return
        }
        MIN_plan--
        let botonPlanNext = document.getElementById(`plan${MIN_plan}`)
        botonPlanNext.style.display = "none"
      }
    }

    if(suscripcion == 1){
        const suscribirseBtn2 = document.getElementById("suscribirseBtn")
        suscribirseBtn2.style.display = "inline-block"
        suscribirseBtn2.textContent = "suscribirse"
        suscribirseParrafo.innerHTML = `¿Quieres más de Bysite? <br> ¡Suscríbete y potencia tu catálogo!`;
    }
    else if(suscripcion == 2){
      suscribirseParrafo.innerHTML = `¿Quieres más de Bysite? <br> ¡Mejora tu suscripcion y obten mas beneficios!`
      const suscribirseBtn2 = document.getElementById("suscribirseBtn")
        suscribirseBtn2.style.display = "inline-block"
        suscribirseBtn2.textContent = "Mejorar"
    }else{
      const suscribirseContainer = document.querySelector(".suscribirse-container").style.display = "none"
    }

})

//pongo el correo en el input de correo
/* setTimeout(()=>{
  const formCheckout__cardholderEmail = document.getElementById("form-checkout__cardholderEmail").value = 'test_user_1347515688@testuser.com'
},1000) */


