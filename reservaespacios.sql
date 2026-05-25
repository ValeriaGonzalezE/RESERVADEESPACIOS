-- phpMyAdmin SQL Dump
-- version 4.7.1
-- https://www.phpmyadmin.net/
--
-- Servidor: sql3.freesqldatabase.com
-- Tiempo de generación: 16-05-2026 a las 04:39:18
-- Versión del servidor: 5.5.54-0ubuntu0.12.04.1
-- Versión de PHP: 7.0.33-0ubuntu0.16.04.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sql3825758`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarios`
--

CREATE TABLE `comentarios` (
  `id` int(11) NOT NULL,
  `espacio_id` int(11) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `comentario` text,
  `estrellas` int(11) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `comentarios`
--

INSERT INTO `comentarios` (`id`, `espacio_id`, `usuario_id`, `comentario`, `estrellas`, `fecha`) VALUES
(1, 1, 1, 'es un espacio bastante completo y con buen cupo para clases sencillas', 4, '2026-05-01 17:06:17');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `espacios`
--

CREATE TABLE `espacios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo_id` int(11) DEFAULT NULL,
  `capacidad` int(11) DEFAULT NULL,
  `ubicacion` varchar(100) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `requiere_pago` enum('si','no') DEFAULT 'no',
  `precio` decimal(10,2) DEFAULT '0.00',
  `descripcion` text,
  `usuario_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `espacios`
--

INSERT INTO `espacios` (`id`, `nombre`, `tipo_id`, `capacidad`, `ubicacion`, `estado`, `requiere_pago`, `precio`, `descripcion`, `usuario_id`) VALUES
(1, 'Salón 101', 1, 35, 'Bloque A', 'activo', 'no', '0.00', NULL, 1),
(2, 'Salón 102', 1, 25, 'Bloque A', 'activo', 'no', '0.00', NULL, 2),
(3, 'Biblioteca Central', 2, 100, 'Bloque B', 'inactivo', 'no', '0.00', NULL, 1),
(4, 'Sala de Estudio 1', 3, 10, 'Bloque C', 'activo', 'no', '0.00', NULL, 2),
(5, 'Auditorio Principal', 4, 200, 'Bloque D', 'activo', 'no', '0.00', NULL, 1),
(6, 'salon de computo', 3, 24, 'Cl. 22 Nte. #2N-24, San Vicente, Cali, Valle del Cauca', 'activo', 'si', '10000.00', 'Salon de computo en el norte de cali', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `espacio_fotos`
--

CREATE TABLE `espacio_fotos` (
  `id` int(11) NOT NULL,
  `espacio_id` int(11) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `espacio_fotos`
--

INSERT INTO `espacio_fotos` (`id`, `espacio_id`, `url`) VALUES
(1, 6, 'http://localhost:3000/uploads/1777663783285-salon1.jpg'),
(2, 6, 'http://localhost:3000/uploads/1777663783288-salon2.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recuperacion_password`
--

CREATE TABLE `recuperacion_password` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `expiracion` datetime DEFAULT NULL,
  `usado` tinyint(4) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `espacio_id` int(11) DEFAULT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `estado` enum('activa','cancelada') DEFAULT 'activa',
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `reservas`
--

INSERT INTO `reservas` (`id`, `usuario_id`, `espacio_id`, `fecha`, `hora_inicio`, `hora_fin`, `estado`, `creado_en`) VALUES
(1, 1, 2, '2026-04-11', '14:00:00', '17:00:00', 'activa', '2026-04-09 23:24:42'),
(2, 1, 5, '2026-04-09', '18:48:00', '18:50:00', 'activa', '2026-04-09 23:46:28'),
(3, 2, 3, '2026-04-12', '12:30:00', '13:30:00', 'activa', '2026-04-11 12:22:01'),
(4, 2, 4, '2026-04-24', '06:00:00', '18:00:00', 'activa', '2026-04-11 13:04:53'),
(5, 2, 1, '2026-04-14', '08:25:00', '09:25:00', 'activa', '2026-04-11 13:25:52'),
(6, 2, 1, '2026-05-02', '17:30:00', '20:00:00', 'activa', '2026-05-01 22:57:12'),
(7, 1, 1, '2026-05-02', '17:40:00', '20:30:00', 'activa', '2026-05-01 22:59:32'),
(8, 2, 2, '2026-05-02', '17:31:00', '22:32:00', 'cancelada', '2026-05-01 23:29:07'),
(9, 1, 6, '2026-05-04', '10:00:00', '12:00:00', 'activa', '2026-05-01 23:37:55'),
(10, 1, 6, '2026-05-01', '12:00:00', '16:00:00', 'cancelada', '2026-05-01 23:39:11'),
(11, 2, 6, '2026-05-08', '10:00:00', '14:00:00', 'activa', '2026-05-08 01:43:03'),
(12, 1, 6, '2026-05-08', '07:00:00', '10:00:00', 'activa', '2026-05-08 02:51:20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `restricciones`
--

CREATE TABLE `restricciones` (
  `id` int(11) NOT NULL,
  `espacio_id` int(11) DEFAULT NULL,
  `dia_semana` enum('lunes','martes','miercoles','jueves','viernes','sabado','domingo') DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_espacio`
--

CREATE TABLE `tipos_espacio` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tipos_espacio`
--

INSERT INTO `tipos_espacio` (`id`, `nombre`) VALUES
(1, 'Salón'),
(2, 'Biblioteca'),
(3, 'Sala de estudio'),
(4, 'Auditorio'),
(5, 'Sala de juegos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `rol` enum('admin','usuario') DEFAULT 'usuario',
  `proveedor` enum('local','google','facebook') DEFAULT 'local',
  `estado` tinyint(4) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `telefono` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `email`, `codigo`, `password`, `foto`, `rol`, `proveedor`, `estado`, `created_at`, `telefono`) VALUES
(1, 'admin', '', 'admin@gmail.com', 'admin', '$2b$10$LTpOddt1XodV6Ye2.QS3FuMN83kyrW.Cw65BLDTitNCfpArcHH1Ca', NULL, 'admin', 'local', 1, '2026-03-24 02:09:43', '3111111111'),
(2, 'Valeria', 'Gonzalez', 'valeriagoes170805@gmail.com', 'valeriagoes170805@gmail.com', '$2b$10$5OFjJy0KxfnxiAO890jO6uBJxNaXXIEEAeRkYZDEc8YdqQI1O1NAe', 'http://localhost:3000/uploads/1778214138138-Captura de pantalla 2026-01-13 142741.png', 'usuario', 'local', 1, '2026-03-28 12:06:08', '3148950404'),
(18, 'prueba', '', 'prueba@prueba.com', 'prueba@prueba.com', '$2b$10$nWXYjD03dREnZozBGMnxxOxJY9C1fiicX46nhl/JedLA0WXati/Pm', NULL, 'usuario', 'local', 1, '2026-03-28 12:54:15', '3021645220'),
(20, 'Michael', 'Moreno', 'michael@gmail.com', 'michael@gmail.com', '$2b$10$akGX9qdZ3Ga99famSVdfzeqWrlPbjsjoet.Ga./l..5aQDGiH47dO', NULL, 'usuario', 'local', 1, '2026-05-08 01:32:14', '3186781934');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `espacio_id` (`espacio_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `espacios`
--
ALTER TABLE `espacios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tipo_id` (`tipo_id`),
  ADD KEY `fk_usuario` (`usuario_id`);

--
-- Indices de la tabla `espacio_fotos`
--
ALTER TABLE `espacio_fotos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `espacio_id` (`espacio_id`);

--
-- Indices de la tabla `recuperacion_password`
--
ALTER TABLE `recuperacion_password`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `idx_reserva` (`espacio_id`,`fecha`,`hora_inicio`,`hora_fin`);

--
-- Indices de la tabla `restricciones`
--
ALTER TABLE `restricciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `espacio_id` (`espacio_id`);

--
-- Indices de la tabla `tipos_espacio`
--
ALTER TABLE `tipos_espacio`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT de la tabla `espacios`
--
ALTER TABLE `espacios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT de la tabla `espacio_fotos`
--
ALTER TABLE `espacio_fotos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `recuperacion_password`
--
ALTER TABLE `recuperacion_password`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT de la tabla `restricciones`
--
ALTER TABLE `restricciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `tipos_espacio`
--
ALTER TABLE `tipos_espacio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`espacio_id`) REFERENCES `espacios` (`id`),
  ADD CONSTRAINT `comentarios_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `espacios`
--
ALTER TABLE `espacios`
  ADD CONSTRAINT `fk_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `espacios_ibfk_1` FOREIGN KEY (`tipo_id`) REFERENCES `tipos_espacio` (`id`);

--
-- Filtros para la tabla `espacio_fotos`
--
ALTER TABLE `espacio_fotos`
  ADD CONSTRAINT `espacio_fotos_ibfk_1` FOREIGN KEY (`espacio_id`) REFERENCES `espacios` (`id`);

--
-- Filtros para la tabla `recuperacion_password`
--
ALTER TABLE `recuperacion_password`
  ADD CONSTRAINT `recuperacion_password_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`espacio_id`) REFERENCES `espacios` (`id`);

--
-- Filtros para la tabla `restricciones`
--
ALTER TABLE `restricciones`
  ADD CONSTRAINT `restricciones_ibfk_1` FOREIGN KEY (`espacio_id`) REFERENCES `espacios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
