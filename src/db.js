const mysql = require('mysql2');

const config = {
    host: process.env.HOSTDB,
    user: process.env.USERDB,
    port: process.env.PORTDB,
    password: process.env.PASSWORDDB,
    database: process.env.DATABASE
};

const getConnection = () => {
    const connection = mysql.createConnection(config);
    connection.connect(err => {
        if (err) {
            console.error('Error en la conexión:', err);
            throw err;
        }
        console.log("La base de datos se ha conectado correctamente");
    });
    return connection;
};

const executeQuery = (sql, params) => {
    return new Promise((resolve, reject) => {
        const connection = getConnection();
        connection.query(sql, params, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
        connection.end(err => {
            if (err) {
                console.error("Error al cerrar la conexión", err);
            }
        });
    });
};

module.exports = { getConnection, executeQuery };

//SET SQL_SAFE_UPDATES = 0;

//
//alter table negocios   KEY `fk_usuario` (`id_unico_dueno`)
//CONSTRAINT `fk_usuario` FOREIGN KEY (`id_unico_dueno`) REFERENCES `usuarios` (`id_unico`)
