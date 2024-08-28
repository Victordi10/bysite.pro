-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 28-08-2024 a las 05:17:40
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bysite_pro`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `negocios`
--

CREATE TABLE `negocios` (
  `id` int(11) NOT NULL,
  `tipo` int(11) DEFAULT 13,
  `nombre` varchar(50) NOT NULL,
  `logo` varchar(250) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `subDominio` varchar(60) DEFAULT NULL,
  `titulo_cover` text DEFAULT NULL,
  `fondo_cover` varchar(255) DEFAULT NULL,
  `color_uno` varchar(20) DEFAULT '#000',
  `color_dos` varchar(20) DEFAULT '#000',
  `color_fondo` varchar(20) DEFAULT '#f5f5f5',
  `tipografia` int(2) DEFAULT 1,
  `id_unico_dueno` varchar(35) NOT NULL,
  `fecha` timestamp NULL DEFAULT current_timestamp(),
  `correo` varchar(255) DEFAULT NULL,
  `whatsapp` text DEFAULT NULL,
  `instagram` text DEFAULT NULL,
  `facebook` text DEFAULT NULL,
  `tiktok` text DEFAULT NULL,
  `youtube` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `negocios`
--

INSERT INTO `negocios` (`id`, `tipo`, `nombre`, `logo`, `descripcion`, `subDominio`, `titulo_cover`, `fondo_cover`, `color_uno`, `color_dos`, `color_fondo`, `tipografia`, `id_unico_dueno`, `fecha`, `correo`, `whatsapp`, `instagram`, `facebook`, `tiktok`, `youtube`) VALUES
(159, NULL, 'm', 'makabro/logo/makabroLogo.jpg', 'es un restaurantedd', NULL, NULL, NULL, '#ed0707', '#2e0d05', '#FFF', 1, '05c1378567147d85edbd9155be15fbe9', '2024-04-15 02:43:38', 'makabro@gmail.comdd', '3103015179', '@makabro', NULL, NULL, NULL),
(226, NULL, 'vataba', 'negocio_226/logo.jpg', 'bysite pro es lo mejor de lo mejor del mundo', 'vatava-2', ' BYSTes lo mejor de ', 'negocio_226/coverfoto.jpg', '#ffffff', '#d99441', '#0d0807', 7, '4819d3a8c96a5e77aee4838660c8d26b', '2024-07-01 16:07:10', 'c', '+57t', 'c', 'c', 'c', 'c'),
(264, NULL, 'nnn', 'negocio_264/logo.jpg', '', 'nnn', NULL, NULL, '#af1818', '#0d0d0d', '#eeeeee', 1, '4819d3a8c96a5e77aee4838660c8d26b', '2024-07-27 18:32:23', '', '+57', '', '', '', ''),
(271, 1, 'rfr', NULL, '', 'negocio271', NULL, NULL, '#000000', '#000000', '#000000', 11, 'b394505f8eb194e52c0f3f64b8f8879d', '2024-08-04 17:02:43', NULL, '+57', NULL, NULL, NULL, NULL),
(274, 1, 'fff', 'negocio_274/logo.jpg', '', 'negocio274', NULL, NULL, '#2fc64d', '#db0000', '#48efff', 1, '4819d3a8c96a5e77aee4838660c8d26b', '2024-08-07 00:44:08', '', '+57', '', '', '', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(255) NOT NULL,
  `fecha` varchar(255) NOT NULL DEFAULT current_timestamp(),
  `negocio_id` int(11) NOT NULL,
  `cliente_nombre` varchar(200) NOT NULL,
  `cliente_telefono` int(11) NOT NULL,
  `Op_entrega` int(11) NOT NULL,
  `direccion_cliente` text DEFAULT NULL,
  `medio_pago` int(11) NOT NULL,
  `nota_cliente` varchar(255) NOT NULL,
  `efectivo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos_productos`
--

CREATE TABLE `pedidos_productos` (
  `id` int(255) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `negocio_id` int(11) NOT NULL,
  `pedido_id` int(11) NOT NULL,
  `producto_cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planes`
--

CREATE TABLE `planes` (
  `planes_id` int(1) NOT NULL,
  `id_mercadopago` varchar(100) NOT NULL,
  `plan_nombre` varchar(20) NOT NULL,
  `plan_precio` int(11) NOT NULL,
  `plan_negocios` int(11) NOT NULL,
  `plan_productos` int(11) NOT NULL,
  `plan_categorias` tinyint(1) NOT NULL,
  `plan_pedidos` tinyint(1) NOT NULL,
  `plan_redes` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `planes`
--

INSERT INTO `planes` (`planes_id`, `id_mercadopago`, `plan_nombre`, `plan_precio`, `plan_negocios`, `plan_productos`, `plan_categorias`, `plan_pedidos`, `plan_redes`) VALUES
(1, '', 'prueba', 0, 1, 10, 0, 1, 0),
(2, '2c93808490595c2001905a16116c0044', 'basico', 50000, 1, 50, 1, 1, 1),
(3, '2c93808490595c1b01905a161367003d', 'emprendedor', 100000, 2, 140, 1, 1, 1),
(4, '2c93808490595c1b01905a1614f4003e', 'empresario', 120000, 3, 300, 1, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `producto_nombre` varchar(50) NOT NULL,
  `producto_precio` int(11) NOT NULL,
  `producto_descripcion` text NOT NULL,
  `producto_logo` text DEFAULT NULL,
  `categoria` varchar(255) DEFAULT NULL,
  `recomendado` tinyint(1) DEFAULT 0,
  `destacado` tinyint(1) DEFAULT 0,
  `producto_fecha` varchar(255) NOT NULL DEFAULT current_timestamp(),
  `negocio_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `producto_nombre`, `producto_precio`, `producto_descripcion`, `producto_logo`, `categoria`, `recomendado`, `destacado`, `producto_fecha`, `negocio_id`) VALUES
(6, 'scdcd', 8880, 'soy el mejor', 'negocio_226/productos/producto_6.jpg', 'ddd_', 1, 1, '2024-07-01 11:14:48', 226),
(7, 'scdcd', 0, '', 'negocio_226/productos/producto_7.jpg', 'kk', 0, 1, '2024-07-01 13:46:13', 226),
(8, 'scdcd', 31132, '', 'negocio_226/productos/producto_8.jpg', 'kk', 0, 1, '2024-07-01 13:46:26', 226),
(10, 'scdcdfff', 777, '', 'negocio_226/productos/producto_10.jpg', 'yy5', 1, 1, '2024-07-01 13:47:03', 226),
(11, 'scdcdfff', 333333, '', 'negocio_226/productos/producto_11.jpg', 'yy5', 1, 1, '2024-07-01 13:47:15', 226),
(13, 'lo mejor del choco vos sabes', 12277, 'jugo de borojo sabroso hecho en choco por concho y ademas puede ser lo mejor del mundo yo en este momento he perdido la ilucion en la vida empiezo a creer que es posible lograr todo lo que uno quiera pero me he desconectado de la matrix y creo que gracias al ssacrificio de nuestro señor jesus yo puedo reconocer mis pecados y puedo ser perdonado pero ya no creo que DIos este pendiente de cada ser humano por que seria ilogico por que puede que hayan personas que hayan sido mejor que yo y sin embargo estan muertas y yo que he cometido tantos error aqui sigo asi que no pienso que Dios tenga control denuestras vidas sino mas bien que somo resultados de nuestras acciones y SOLO DEBEMOS  darle gracias a dios por lo que contamos ahora mismo por ejemplo le estoy agradecido pordarme la oportunidad de luchar cada dia por lo que quiero pero me niego a aceptar que por que dios no quierer que me valla bien no me va a ir bien la vida debe de tener algun manual o algo que no se ve a simple vista que es lo que hace queotreas personas tengan exito y otras no', 'negocio_226/productos/producto_13.jpg', 'yy5', 1, 1, '2024-07-05 12:51:16', 226),
(21, 'oko', 0, '', 'negocio_226/productos/producto_21.jpg', NULL, 0, 0, '2024-07-27 13:30:42', 226),
(22, 'jj', 0, '', 'negocio_226/productos/producto_22.jpg', NULL, 0, 0, '2024-07-27 13:31:55', 226),
(23, 'jjkk', 0, '', 'negocio_264/productos/producto_23.jpg', NULL, 0, 0, '2024-07-27 13:32:35', 264),
(30, 'zzxzxz', 22211, 'sczczz\r\nzxzxzxz\r\nxzxzxzxz', 'negocio_226/productos/producto_30.jpg', NULL, 0, 0, '2024-08-09 22:53:48', 226),
(31, 'sssxsx', 8, 'x<<<x<x<x<<<x<xc bfbxfbfx fb fbcxvcx fvcxvcxvc f\r\n\r\n\r\n\r\n\r\n\r\n\r\nxzxzx dv\r\ndvdv\r\nd\r\nvdvdvd', NULL, NULL, 0, 0, '2024-08-09 22:56:05', 226);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipografias`
--

CREATE TABLE `tipografias` (
  `id` int(11) NOT NULL,
  `tipografia` varchar(30) NOT NULL,
  `font_family` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipografias`
--

INSERT INTO `tipografias` (`id`, `tipografia`, `font_family`) VALUES
(1, 'sans-serif', 'sans-serif'),
(2, 'serif', 'serif'),
(3, 'monospace', 'monospace'),
(4, 'Verdana', 'Verdana, Geneva, Tahoma, sans-serif'),
(5, 'Times New Roman', '\'Times New Roman\', Times, serif'),
(6, 'Gill Sans', '\'Gill Sans\', \'Gill Sans MT\', Calibri, \'Trebuchet MS\', sans-serif'),
(7, 'Roboto', 'Roboto, sans-serif'),
(8, 'Open Sans', '\"Open Sans\", sans-serif'),
(9, 'Lato', 'Lato, sans-serif'),
(10, 'Montserrat', 'Montserrat, sans-serif'),
(11, 'Poppins', 'Poppins, sans-serif'),
(12, 'Raleway', 'Raleway, sans-serif'),
(13, 'Nunito', 'Nunito, sans-serif'),
(14, 'Oswald', 'Oswald, sans-serif'),
(15, 'Ubuntu', 'Ubuntu, sans-serif'),
(16, 'Playfair Display', '\"Playfair Display\", serif');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tiposNegocios`
--

CREATE TABLE `tiposNegocios` (
  `id` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL DEFAULT 'otro'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tiposNegocios`
--

INSERT INTO `tiposNegocios` (`id`, `tipo`) VALUES
(1, 'Alimentos y Bebidas'),
(2, 'Moda y Accesorios'),
(3, 'Electrónica y Tecnología'),
(4, 'Hogar y Jardín'),
(5, 'Belleza y Cuidado Personal'),
(6, 'Deportes y Aire Libre'),
(7, 'Libros y Entretenimiento'),
(8, 'Servicios Profesionales'),
(9, 'Salud y Bienestar'),
(10, 'Automotriz'),
(11, 'Arte y Artesanía'),
(12, 'Regalos y Eventos'),
(13, 'otro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contraseña` varchar(100) NOT NULL,
  `fecha_registro` timestamp NULL DEFAULT current_timestamp(),
  `terminos_condiciones` varchar(15) NOT NULL,
  `id_unico` varchar(32) NOT NULL,
  `suscripcion` int(1) DEFAULT 1,
  `seSuscribio` varchar(255) DEFAULT NULL,
  `id_suscripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `correo`, `contraseña`, `fecha_registro`, `terminos_condiciones`, `id_unico`, `suscripcion`, `seSuscribio`, `id_suscripcion`) VALUES
(49, '12345@gmail.com', '12345', '2024-04-15 02:43:18', 'Aceptado', '05c1378567147d85edbd9155be15fbe9', 1, NULL, NULL),
(58, 'victor@gmail.com', '$2a$10$gaH.d2SEBr7yPwyaw8XRx.Ve8xgqy8TAE4gGhnSnvSbISzS3pPK9S', '2024-04-29 09:19:59', 'Aceptado', 'dd51f82491a8c840ff1388ef23c8208c', 1, NULL, NULL),
(59, '1234@gmail.com', '$2a$10$8dgWiun1rdmDdJ6InJfi3epdvysk4NNmdFuE7tCsC1F8gyUtA6LuC', '2024-04-29 09:20:17', 'Aceptado', '4819d3a8c96a5e77aee4838660c8d26b', 4, NULL, NULL),
(69, 'test_user_1347515688@testuser.com', 'vdsvsdfvfsvvevdfvfdf', '2024-07-07 05:57:46', '', '', 3, '2024-07-15T18:39:42.500Z', '81f0e5dc439b48139d8c0e25a763e8c2'),
(86, 'cordobav444@gmail.com', '$2a$10$52Tl5JNi9.hvCVDk8CctSed07ABNu61uZUHdPeBe3yvbJLk6Pnoj2', '2024-07-14 16:56:40', 'Aceptado', 'b394505f8eb194e52c0f3f64b8f8879d', 1, NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `negocios`
--
ALTER TABLE `negocios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sudDominio` (`subDominio`),
  ADD KEY `fk_usuario` (`id_unico_dueno`),
  ADD KEY `tipografia` (`tipografia`),
  ADD KEY `tipo` (`tipo`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pedidos_productos`
--
ALTER TABLE `pedidos_productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `planes`
--
ALTER TABLE `planes`
  ADD PRIMARY KEY (`planes_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `negocio_id` (`negocio_id`);

--
-- Indices de la tabla `tipografias`
--
ALTER TABLE `tipografias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tiposNegocios`
--
ALTER TABLE `tiposNegocios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo_unico` (`correo`),
  ADD KEY `idx_id_unico` (`id_unico`),
  ADD KEY `suscripcion` (`suscripcion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `negocios`
--
ALTER TABLE `negocios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=275;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedidos_productos`
--
ALTER TABLE `pedidos_productos`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `planes`
--
ALTER TABLE `planes`
  MODIFY `planes_id` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `tipografias`
--
ALTER TABLE `tipografias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `tiposNegocios`
--
ALTER TABLE `tiposNegocios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `negocios`
--
ALTER TABLE `negocios`
  ADD CONSTRAINT `fk_usuario` FOREIGN KEY (`id_unico_dueno`) REFERENCES `usuarios` (`id_unico`),
  ADD CONSTRAINT `negocios_ibfk_1` FOREIGN KEY (`tipografia`) REFERENCES `tipografias` (`id`),
  ADD CONSTRAINT `negocios_ibfk_2` FOREIGN KEY (`tipo`) REFERENCES `tiposNegocios` (`id`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`negocio_id`) REFERENCES `negocios` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`suscripcion`) REFERENCES `planes` (`planes_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
