USE bysite_pro;
SHOW tables;
SELECT * FROM usuarios;
DESCRIBE negocios;
UPDATE makabro SET categoria = 'especiales' WHERE categoria = 'Especiales';
ALTER TABLE usuarios DROP COLUMN user_telefono; 
ALTER TABLE usuarios
ALTER COLUMN suscripcion SET DEFAULT 'prueba';
DROP TABLE bysite_pro;
SET SQL_SAFE_UPDATES = 0;
DELETE FROM usuarios WHERE id > 50;

DELIMITER //

CREATE PROCEDURE CrearTablaNegocio(nuevoId INT, nuevoNombre VARCHAR(255))
BEGIN
    DECLARE tablaNombre VARCHAR(255);
    SET tablaNombre = CONCAT(REPLACE(nuevoNombre, ' ', '_'), '_', nuevoId);
    SET @sql = CONCAT('CREATE TABLE IF NOT EXISTS ', tablaNombre, ' (
                        id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
                        producto_nombre VARCHAR(100) NOT NULL, 
                        producto_descripcion TEXT, 
                        producto_precio INT DEFAULT 0,
                        producto_logo VARCHAR(255),categoria VARCHAR(150),
                        producto_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
                        negocio_id INT, 
                        FOREIGN KEY (negocio_id) REFERENCES negocios(id)
                      )');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //

DELIMITER ;

sudo ln -s /etc/nginx/sites-available/bysite.pro /etc/nginx/sites-enabled/

