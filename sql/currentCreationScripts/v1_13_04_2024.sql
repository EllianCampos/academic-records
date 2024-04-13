-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 13-04-2024 a las 22:44:59
-- Versión del servidor: 8.0.36-0ubuntu0.22.04.1
-- Versión de PHP: 8.1.2-1ubuntu2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `Ellian_academic_records`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `attendance`
--

CREATE TABLE `attendance` (
  `id` int NOT NULL,
  `courseCode` varchar(4) NOT NULL,
  `description` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(100) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `attendancelines`
--

CREATE TABLE `attendancelines` (
  `id` int NOT NULL,
  `attendaceId` int NOT NULL,
  `studentId` int NOT NULL,
  `state` varchar(50) NOT NULL,
  `observations` varchar(500) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(100) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comments`
--

CREATE TABLE `comments` (
  `id` int NOT NULL,
  `description` varchar(1000) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `courses`
--

CREATE TABLE `courses` (
  `code` varchar(4) NOT NULL,
  `name` varchar(100) NOT NULL,
  `durationHours` int NOT NULL,
  `numberStudentsEnrolled` int NOT NULL,
  `schedule` varchar(500) DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `quota` int NOT NULL,
  `isFinished` tinyint(1) NOT NULL,
  `attendacePercentaje` decimal(5,2) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(100) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `openEnrollment` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `enrollment`
--

CREATE TABLE `enrollment` (
  `id` int NOT NULL,
  `courseCode` varchar(4) NOT NULL,
  `studentId` int NOT NULL,
  `studentCedula` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluations`
--

CREATE TABLE `evaluations` (
  `id` int NOT NULL,
  `courseCode` varchar(4) NOT NULL,
  `name` varchar(100) NOT NULL,
  `percentaje` decimal(5,2) NOT NULL,
  `points` int NOT NULL,
  `isAutoCalculated` tinyint(1) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(100) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grades`
--

CREATE TABLE `grades` (
  `id` int NOT NULL,
  `studentId` int NOT NULL,
  `evaluationId` int NOT NULL,
  `points` int NOT NULL,
  `feedback` varchar(500) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(100) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gradesheaders`
--

CREATE TABLE `gradesheaders` (
  `id` int NOT NULL,
  `evaluationId` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `points` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(100) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gradeslines`
--

CREATE TABLE `gradeslines` (
  `id` int NOT NULL,
  `gradeHeaderId` int NOT NULL,
  `studentId` int NOT NULL,
  `points` int NOT NULL,
  `feedback` varchar(500) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(100) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `invitations`
--

CREATE TABLE `invitations` (
  `id` int NOT NULL,
  `senderId` int NOT NULL,
  `receptorId` int NOT NULL,
  `courseCode` varchar(4) NOT NULL,
  `state` varchar(50) NOT NULL,
  `senderName` varchar(100) NOT NULL,
  `courseName` varchar(100) NOT NULL,
  `createAt` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `students`
--

CREATE TABLE `students` (
  `id` int NOT NULL,
  `cedula` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `bornDate` date NOT NULL,
  `gender` varchar(25) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(75) NOT NULL,
  `disability` varchar(15) NOT NULL,
  `disabilityDescription` varchar(100) DEFAULT NULL,
  `provincia` varchar(80) DEFAULT NULL,
  `canton` varchar(80) DEFAULT NULL,
  `distrito` varchar(80) DEFAULT NULL,
  `comunidad` varchar(80) DEFAULT NULL,
  `observations` varchar(500) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(100) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usercourses`
--

CREATE TABLE `usercourses` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `courseCode` varchar(4) NOT NULL,
  `isCreator` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `email` varchar(75) NOT NULL,
  `password` varchar(60) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_courseId_attendance_idx` (`courseCode`);

--
-- Indices de la tabla `attendancelines`
--
ALTER TABLE `attendancelines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dk_studentCedula_attendanceLiness_idx` (`studentId`),
  ADD KEY `fk_attendaceHeaderId_attendandeLines_idx` (`attendaceId`);

--
-- Indices de la tabla `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`code`),
  ADD UNIQUE KEY `code_UNIQUE` (`code`);

--
-- Indices de la tabla `enrollment`
--
ALTER TABLE `enrollment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_courseCode_enrollment_idx` (`courseCode`),
  ADD KEY `fk_studentCedula_enrollment_idx` (`studentId`);

--
-- Indices de la tabla `evaluations`
--
ALTER TABLE `evaluations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_courseCode_evaluations_idx` (`courseCode`);

--
-- Indices de la tabla `grades`
--
ALTER TABLE `grades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_studentCedula_grades_idx` (`studentId`),
  ADD KEY `fk_evaluationId_grades_idx` (`evaluationId`);

--
-- Indices de la tabla `gradesheaders`
--
ALTER TABLE `gradesheaders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_evaluationId_gradesheaders_idx` (`evaluationId`);

--
-- Indices de la tabla `gradeslines`
--
ALTER TABLE `gradeslines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_gradeHeaderId_gradeslines_idx` (`gradeHeaderId`),
  ADD KEY `fk_studentCedula_gradeslines_idx` (`studentId`);

--
-- Indices de la tabla `invitations`
--
ALTER TABLE `invitations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_senderId_invitations_idx` (`senderId`),
  ADD KEY `fk_receptorId_invitations_idx` (`receptorId`),
  ADD KEY `fk_courseCode_invitations_idx` (`courseCode`);

--
-- Indices de la tabla `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usercourses`
--
ALTER TABLE `usercourses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_userId_usercourses_idx` (`userId`),
  ADD KEY `fk_courseCode_usercourses_idx` (`courseCode`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `attendancelines`
--
ALTER TABLE `attendancelines`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `evaluations`
--
ALTER TABLE `evaluations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `grades`
--
ALTER TABLE `grades`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `gradesheaders`
--
ALTER TABLE `gradesheaders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `gradeslines`
--
ALTER TABLE `gradeslines`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `invitations`
--
ALTER TABLE `invitations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `students`
--
ALTER TABLE `students`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usercourses`
--
ALTER TABLE `usercourses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `fk_courseId_attendance` FOREIGN KEY (`courseCode`) REFERENCES `courses` (`code`) ON DELETE CASCADE;

--
-- Filtros para la tabla `attendancelines`
--
ALTER TABLE `attendancelines`
  ADD CONSTRAINT `dk_studentId_attendanceLiness` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_attendaceId_attendandeLines` FOREIGN KEY (`attendaceId`) REFERENCES `attendance` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `enrollment`
--
ALTER TABLE `enrollment`
  ADD CONSTRAINT `fk_courseCode_enrollment` FOREIGN KEY (`courseCode`) REFERENCES `courses` (`code`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_studenId_enrollment` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `evaluations`
--
ALTER TABLE `evaluations`
  ADD CONSTRAINT `fk_courseCode_evaluations` FOREIGN KEY (`courseCode`) REFERENCES `courses` (`code`) ON DELETE CASCADE;

--
-- Filtros para la tabla `grades`
--
ALTER TABLE `grades`
  ADD CONSTRAINT `fk_evaluationId_grades` FOREIGN KEY (`evaluationId`) REFERENCES `evaluations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_studentId_grades` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `gradesheaders`
--
ALTER TABLE `gradesheaders`
  ADD CONSTRAINT `fk_evaluationId_gradesheaders` FOREIGN KEY (`evaluationId`) REFERENCES `evaluations` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `gradeslines`
--
ALTER TABLE `gradeslines`
  ADD CONSTRAINT `fk_gradeHeaderId_gradeslines` FOREIGN KEY (`gradeHeaderId`) REFERENCES `gradesheaders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_studentId_gradeslines` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `invitations`
--
ALTER TABLE `invitations`
  ADD CONSTRAINT `fk_courseCode_invitations` FOREIGN KEY (`courseCode`) REFERENCES `courses` (`code`),
  ADD CONSTRAINT `fk_receptorId_invitations` FOREIGN KEY (`receptorId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_senderId_invitations` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `usercourses`
--
ALTER TABLE `usercourses`
  ADD CONSTRAINT `fk_courseCode_usercourses` FOREIGN KEY (`courseCode`) REFERENCES `courses` (`code`) ON DELETE RESTRICT,
  ADD CONSTRAINT `fk_userId_usercourses` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
