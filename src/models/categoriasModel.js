const { executeQuery } = require('../db');

const almacenarCategoria = (negocioID, categoria, productos) => {
    if (productos.length === 0) {
        return Promise.resolve(); // No hay productos para actualizar
    }
    const placeholders = productos.map(() => '?').join(', ');
    const sql = `UPDATE productos SET categoria = ? WHERE id IN (${placeholders}) AND negocio_id = ?`;
    const values = [categoria, ...productos,negocioID];
    return executeQuery(sql, values);
};

const renombrarCategoria = (negocioID, newCategoria,oldCategoria)=>{
    const sql = `UPDATE productos SET categoria = ? WHERE categoria = ? AND negocio_id = ?`;
    executeQuery(sql,[newCategoria,oldCategoria,negocioID])
}

const eliminarCollecion = (negocioID,categoria)=>{
    const sql = `UPDATE productos SET categoria = ? WHERE categoria = ? AND negocio_id = ?`;
    executeQuery(sql,[null,categoria,negocioID])
}

const eliminarProductosColeccion =(negocioID,productos)=>{
    if (productos.length === 0) {
        return Promise.resolve(); // No hay productos para actualizar
    }
    const placeholders = productos.map(() => '?').join(', ');

    const sql = `UPDATE productos SET categoria = ? WHERE id IN (${placeholders}) AND negocio_id = ?`;
    const values = [null, ...productos,negocioID];
    executeQuery(sql,values)
}

//sub categorias
const recomendarProduc = (productoID,negocioID)=>{
    const sql = 'UPDATE productos SET recomendado = 1 WHERE id = ? '
    executeQuery(sql,productoID)
}
const noRecomendarProduc = (productoID,negocioID)=>{
    const sql = 'UPDATE productos SET recomendado = 0 WHERE id = ?'
    executeQuery(sql,productoID)
}
const destacarProduc = (productoID,negocioID)=>{
    const sql = 'UPDATE productos SET destacado = 1 WHERE id = ?'
    executeQuery(sql,productoID)
}
const noDestacarProduc = (productoID,negocioID)=>{
    const sql = 'UPDATE productos SET destacado = 0 WHERE id = ?'
    executeQuery(sql,productoID)
}

module.exports = {
    almacenarCategoria,
    renombrarCategoria,
    eliminarCollecion,
    eliminarProductosColeccion,
    recomendarProduc,
    noRecomendarProduc,
    destacarProduc,
    noDestacarProduc
};
