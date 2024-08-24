//ajustes para el menu de la pagina
const boMenu = document.getElementById("boMenu")
boMenu.addEventListener("click",function(){
    abrirMenu()
});
const boCMenu = document.getElementById("boCMenu")
boCMenu.addEventListener("click",function(){
    cerrarMenu()
});
const menuPhone = document.querySelector(".menu-container_phone")
//funciones para abrir y cerrar el menu
const abrirMenu = ()=>{
    boMenu.style.display = 'none'
    boCMenu.style.display = 'block'
    menuPhone.classList.add("mostrarMenu")
    
};
function cerrarMenu() {
    if (menuPhone.classList.contains("mostrarMenu")) {
        menuPhone.classList.remove("mostrarMenu");
        boMenu.style.display = "block";
        boCMenu.style.display = "none"
        
    }
}
//cierra el menu si hay scroll
window.addEventListener("scroll",function(){
    cerrarMenu()
})
// Ocultar menú responsivo al hacer clic en cualquier parte del documento excepto el menú
document.addEventListener("click", function (event) {
    const isClickInside = menuPhone.contains(event.target) || boMenu.contains(event.target);

    if (!isClickInside) {
        cerrarMenu()
    }
});
//cierra el menu si se cambia el tamaño de la pantalla
window.addEventListener("resize", cerrarMenu);
