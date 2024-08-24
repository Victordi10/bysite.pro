-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 24-08-2024 a las 21:17:32
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
-- Indices de la tabla `planes`
--
ALTER TABLE `planes`
  ADD PRIMARY KEY (`planes_id`);

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
-- AUTO_INCREMENT de la tabla `planes`
--
ALTER TABLE `planes`
  MODIFY `planes_id` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`suscripcion`) REFERENCES `planes` (`planes_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
