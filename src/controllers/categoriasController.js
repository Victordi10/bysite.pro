const { almacenarCategoria,
        renombrarCategoria,
        eliminarCollecion,
        eliminarProductosColeccion,
        recomendarProduc,
        noRecomendarProduc,
        destacarProduc,
        noDestacarProduc } = require('../models/categoriasModel.js');
const {obtenerSuscribcion} = require('../middlewares/verificarPlan.js')

const data = {};

const crearCategoria = async (req, res) => {
    try {
        const negocioID = req.params.idNegocios;
        const idUnico = req.query.idUnico
        console.log(req.body)
        const datos = req.body
        let categoria = datos.categoria.replace(/[^\w\s]/g, ' ').replace(/\s+/g, '_').trim();
 // Reemplaza los espacios por guiones bajos
        
        // Agregar guion bajo si la categoría empieza con un número
        if (/^\d/.test(categoria)) {
          categoria = `_${categoria}`;
        }
        const productos = datos.productos;

        const suscripcion = await obtenerSuscribcion(idUnico)
        if(suscripcion > 1){
            await almacenarCategoria(negocioID, categoria, productos);
            data.mensaje = 'Categoría creada';
            res.status(200).json(data);
        }else{
            data.mensaje = 'No se creo la categoria';
            res.status(403).json(data);
        }
        
    } catch (error) {
        console.error("Error al intentar guardar la categoría", error);
        data.mensaje = 'Error al intentar crear la categoría';
        res.status(500).json(data);
    }
};

const actualizarCategoria = async(req,res)=>{
    try {
        const negocioID = req.params.idNegocios;
        const idUnico = req.query.idUnico

        const datos = req.body;
        console.log("jvbdbuodwf",datos)
        const newC = datos.new.replace(/[^\w\s]/g, ' ').replace(/\s+/g, '_').trim()
        const old = datos.old.replace(/[^\w\s]/g, ' ').replace(/\s+/g, '_').trim();


        const suscripcion = await obtenerSuscribcion(idUnico)
        if(suscripcion > 1){
            await renombrarCategoria(negocioID, newC, old);
            data.mensaje = 'Categoría renombrada';
            res.status(200).json(data);
        }else{
            data.mensaje = 'No se renombro la categoria';
            res.status(403).json(data);
        }
    } catch (error) {
        console.error("Error al intentar guardar la categoría", error);
        data.mensaje = 'Error al intentar guardar la categoría';
        res.status(500).json(data);
    }
}

const EliminarCategoria = async (req,res)=>{
    try {
        const negocioID = req.params.idNegocios;
        const categoria = req.body.categoria.replace(/\s+/g, '_').trim();
        console.log("jvbdbuodwf",categoria)

        await eliminarCollecion(negocioID, categoria);
            data.mensaje = 'Categoría eliminada';
            res.status(200).json(data);

    } catch (error) {
        console.error("Error al intentar eliminar la categoría", error);
        data.mensaje = 'Error al intentar eliminar la categoría';
        res.status(500).json(data);
    }
}

//funcion de editar categoria
const editarCategoria = async(req,res)=>{
    try {
        const negocioID = req.params.idNegocios;
        const idUnico = req.query.idUnico
        console.log(req.body)
        const datos = req.body;
        const categoria = datos.categoria.replace(/\s+/g, '_').trim()
        const producSellec = datos.productosSeleccionados;
        const producNoSellec = datos.productosNoSeleccionados;

        const suscripcion = await obtenerSuscribcion(idUnico)
        if(suscripcion > 1){
            await almacenarCategoria(negocioID, categoria, producSellec);
            await eliminarProductosColeccion(negocioID,producNoSellec)
            data.mensaje = 'Categoría Editada';
            res.status(200).json(data);
        }else{
            data.mensaje = 'No se creo la categoria';
            res.status(403).json(data);
        }
    } catch (error) {
        
    }
}

const recomendarProducto = async (req, res) => {
    try {
        const negocioID = req.params.idNegocio;
        const { productoID } = req.body;
        await recomendarProduc(productoID, negocioID);
        res.status(200).send("exito");
    } catch (error) {
        console.error("Error al recomendar producto", error);
        res.status(500).send("error");
    }
}

const noRecomendarProducto = async (req, res) => {
    try {
        const negocioID = req.params.idNegocio;
        const { productoID } = req.body;
        await noRecomendarProduc(productoID, negocioID);
        res.status(200).send("exito");
    } catch (error) {
        console.error("Error al no recomendar producto", error);
        res.status(500).send("error");
    }
}

const destacarProducto = async (req, res) => {
    try {
        const negocioID = req.params.idNegocio;
        const { productoID } = req.body;
        await destacarProduc(productoID, negocioID);
        res.status(200).send("exito");
    } catch (error) {
        console.error("Error al destacar producto", error);
        res.status(500).send("error");
    }
}

const noDestacarProducto = async (req, res) => {
    try {
        const negocioID = req.params.idNegocio;
        const { productoID } = req.body;
        await noDestacarProduc(productoID, negocioID);
        res.status(200).send("exito");
    } catch (error) {
        console.error("Error al no destacar producto", error);
        res.status(500).send("error");
    }
}

module.exports = {
    crearCategoria,
    actualizarCategoria,
    EliminarCategoria,
    editarCategoria,
    recomendarProducto,
    noRecomendarProducto,
    destacarProducto,
    noDestacarProducto
};
