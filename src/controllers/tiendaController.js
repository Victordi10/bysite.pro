const path = require('path');
const fs = require('fs');
const {enviarDatosNegocio,
        categoriasUnicas,
        enviarProductos,
        categoriasPortadas,
        obtenerTipografiaNegocio,
        buscarSubdominio,
        obtenerFontFamily } = require("../models/tiendaModel.js")
const {obtenerSuscribcion} = require("../middlewares/verificarPlan.js")

const indexTiendaDominio = async (req, res) => {
    try {
        const htmlPath = path.join(__dirname, '../../public/venta/plantilla1', 'home.html');
        const html404Path = path.join(__dirname, '../../public', 'pagina404.html');
        const html404 = await fs.promises.readFile(html404Path, 'utf8');
        const html = await fs.promises.readFile(htmlPath, 'utf8');

        const negocio = req.negocio;
        if (negocio) {
            const negocioNombre = negocio.nombre;
            const id_unico_dueno = negocio.id_unico_dueno;
            const idNegocio = negocio.id;
            console.log("ID único dueño: ", id_unico_dueno);

            const negocioNombreConEspacios = negocioNombre.replace(/_/g, ' ');
            const htmlConCampos = html
                .replace('%=negocioNombre%>', negocioNombreConEspacios)
                .replace('%=negocioNombre2%>', negocioNombreConEspacios)
                .replace('%=negocioNombre4%>', negocioNombreConEspacios)
                .replace('%=idNegocio%>', idNegocio)
                .replace('%=id_unico_dueno%>', id_unico_dueno);

            res.send(htmlConCampos);
        } else {
            console.log("El negocio no existe");
            res.send(html404);
        }
    } catch (err) {
        console.error("Error al leer el archivo HTML o al obtener ID único: ", err);
        res.status(500).send("Error en el servidor");
    }
};

// Función para redirigir a la URL con el subdominio
const linkAnterior = async (req, res) => {
    try {
        const idNegocio = req.params.idNegocio;
        const subdominio = await buscarSubdominio(idNegocio);

        if (subdominio) {
            res.redirect(`https://${subdominio}.bysite.pro`);
        } else {
            res.sendFile(path.join(__dirname, '../../public/pagina404.html'));
        }
    } catch (error) {
        res.sendFile(path.join(__dirname, '../../public/pagina404.html'));
        console.error("Error en el link anterior", error);
    }
};

 //logica para cargar los datos del negocio y las categorias
const datosNegocios = async (req,res)=>{
    const subDominio = req.subdomain; // Utiliza el subdominio detectado
    const negocio_id  = req.negocio.id
    console.log("cargando datos para : ",subDominio)
    try {
        const enviarNegocio = await  enviarDatosNegocio(subDominio)
        const enviarCategoria = await categoriasUnicas(negocio_id )
        const productos = await enviarProductos(negocio_id )
        const catePortadas = await categoriasPortadas(negocio_id )
        const negocioTipografia = await obtenerTipografiaNegocio(subDominio)
        const font_family = await obtenerFontFamily(negocioTipografia[0].tipografia)
        console.log("Font Family:", font_family[0],negocioTipografia)
        //console.log("tipografiiiii",negocioTipografia[0].tipografia,font_family[0])
        const json = {
            datos: enviarNegocio,
            categorias: enviarCategoria,
            productos:productos,
            font_family:font_family[0],
            catePortadas:catePortadas
            
        };

        res.status(200).json(json)
    } catch (error) {
        console.error("Error en el servidor, al cargar el negocio y categorias:", error);
        res.status(500).send("Error en el servidor");
    }

}

module.exports = {
    datosNegocios,
    indexTiendaDominio,
    linkAnterior
}