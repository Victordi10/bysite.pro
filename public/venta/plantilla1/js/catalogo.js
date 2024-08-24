/* //logica para llamara los datos del negocio
const llamarDatosNegocio = async ()=>{
    const nombreNegocioLogo = document.querySelector("title").textContent
    const idNegocio = document.getElementById("idNegocio").value

    console.log(idNegocio)
    try {
        const response = await fetch(`/${nombreNegocioLogo}/${idNegocio}/catalogo/datos`)
        if (!response.ok) {
            throw new Error(`Error al cargar los datos del negocio: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al cargar los datos del negocio:", error);
        throw error; // Propaga el error para que se maneje en el contexto de llamada
    }
}  */

/* const imprimirDatosNegocio =(data)=>{
    data.forEach(dato => {
        const id_unico = document.querySelector("#id_unico").value = dato.id_unico_dueno
        //imprimo el icono del logo en el head
         const logoIcon = document.getElementById("logoIcon")
         logoIcon.href = `/${id_unico}/${dato.logo}`
         //logo del header de la pagina
         const logoHeader = document.getElementById("logoHeader")
         logoHeader.src = `/${id_unico}/${dato.logo}`
         logoHeader.alt = data.descripcion
/*         //nombre del negocio en la cabecera
        const nombreNegocioLogo = document.querySelector(".nav_logo")
        nombreNegocioLogo.textContent = dato.nombre */
/*         //imprimo la descripcion del negocio
        const coverParrafo = document.querySelector(".cover-parrafo")
        coverParrafo.textContent = dato.descripcion
        //agrego el numero al link de whatsApp
        const enlaceWhatsApp = document.querySelector(".enlaceWhatsApp")
        enlaceWhatsApp.href = `https://wa.me/${dato.telefono_whatsapp}` 
        //creo custom property para los colores
        document.documentElement.style.setProperty('--color-uno', `${dato.color_uno}`);
        document.documentElement.style.setProperty('--color-dos', `${dato.color_dos}`);
    });
} */









//logica para hacer focus en los productos