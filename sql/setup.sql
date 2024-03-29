-- MySQL Script generated by MySQL Workbench
-- Tue Mar 19 17:29:37 2024
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema academic_records
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `academic_records` ;

-- -----------------------------------------------------
-- Schema academic_records
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `academic_records` DEFAULT CHARACTER SET utf8mb3 ;
USE `academic_records` ;

-- -----------------------------------------------------
-- Table `academic_records`.`students`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academic_records`.`students` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cedula` INT(9) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `lastname` VARCHAR(50) NOT NULL,
  `bornDate` DATE NOT NULL,
  `gender` VARCHAR(25) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(75) NOT NULL,
  `disability` VARCHAR(15) NOT NULL,
  `disabilityDescription` VARCHAR(100) NULL DEFAULT NULL,
  `provincia` VARCHAR(80) NULL DEFAULT NULL,
  `canton` VARCHAR(80) NULL DEFAULT NULL,
  `distrito` VARCHAR(80) NULL DEFAULT NULL,
  `comunidad` VARCHAR(80) NULL DEFAULT NULL,
  `observations` VARCHAR(500) NULL DEFAULT NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` VARCHAR(100) NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  `updatedBy` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `academic_records`.`courses`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academic_records`.`courses` (
  `code` VARCHAR(4) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `durationHours` INT NOT NULL,
  `numberStudentsEnrolled` INT NOT NULL,
  `schedule` VARCHAR(500) NULL DEFAULT NULL,
  `startDate` DATE NULL DEFAULT NULL,
  `endDate` DATE NULL DEFAULT NULL,
  `quota` INT NOT NULL,
  `isFinished` TINYINT(1) NOT NULL,
  `attendacePercentaje` DECIMAL(5,2) NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` VARCHAR(100) NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  `updatedBy` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`code`),
  UNIQUE INDEX `code_UNIQUE` (`code` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `academic_records`.`attendance`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academic_records`.`attendance` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `courseCode` VARCHAR(4) NOT NULL,
  `description` VARCHAR(50) NOT NULL,
  `date` DATE NOT NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` VARCHAR(100) NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  `updatedBy` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_courseId_attendance_idx` (`courseCode` ASC) VISIBLE,
  CONSTRAINT `fk_courseId_attendance`
    FOREIGN KEY (`courseCode`)
    REFERENCES `academic_records`.`courses` (`code`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `academic_records`.`attendancelines`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academic_records`.`attendancelines` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `attendaceId` INT NOT NULL,
  `studentId` INT NOT NULL,
  `state` VARCHAR(50) NOT NULL,
  `observations` VARCHAR(500) NOT NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` VARCHAR(100) NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  `updatedBy` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `dk_studentCedula_attendanceLiness_idx` (`studentId` ASC) VISIBLE,
  INDEX `fk_attendaceHeaderId_attendandeLines_idx` (`attendaceId` ASC) VISIBLE,
  CONSTRAINT `dk_studentId_attendanceLiness`
    FOREIGN KEY (`studentId`)
    REFERENCES `academic_records`.`students` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_attendaceId_attendandeLines`
    FOREIGN KEY (`attendaceId`)
    REFERENCES `academic_records`.`attendance` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `academic_records`.`enrollment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academic_records`.`enrollment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `courseCode` VARCHAR(4) NOT NULL,
  `studentId` INT NOT NULL,
  `studentCedula` INT(9) NOT NULL,
  `createdAt` DATETIME NULL DEFAULT now(),
  `createdBy` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_courseCode_enrollment_idx` (`courseCode` ASC) VISIBLE,
  INDEX `fk_studentCedula_enrollment_idx` (`studentId` ASC) VISIBLE,
  CONSTRAINT `fk_courseCode_enrollment`
    FOREIGN KEY (`courseCode`)
    REFERENCES `academic_records`.`courses` (`code`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_studenId_enrollment`
    FOREIGN KEY (`studentId`)
    REFERENCES `academic_records`.`students` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `academic_records`.`evaluations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academic_records`.`evaluations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `courseCode` VARCHAR(4) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `percentaje` DECIMAL(5,2) NOT NULL,
  `points` INT NOT NULL,
  `isAutoCalculated` TINYINT(1) NOT NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` VARCHAR(100) NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  `updatedBy` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_courseCode_evaluations_idx` (`courseCode` ASC) VISIBLE,
  CONSTRAINT `fk_courseCode_evaluations`
    FOREIGN KEY (`courseCode`)
    REFERENCES `academic_records`.`courses` (`code`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `academic_records`.`grades`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academic_records`.`grades` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `studentId` INT NOT NULL,
  `evaluationId` INT NOT NULL,
  `points` INT NOT NULL,
  `feedback` VARCHAR(500) NULL DEFAULT NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` VARCHAR(100) NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  `updatedBy` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_studentCedula_grades_idx` (`studentId` ASC) VISIBLE,
  INDEX `fk_evaluationId_grades_idx` (`evaluationId` ASC) VISIBLE,
  CONSTRAINT `fk_evaluationId_grades`
    FOREIGN KEY (`evaluationId`)
    REFERENCES `academic_records`.`evaluations` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_studentId_grades`
    FOREIGN KEY (`studentId`)
    REFERENCES `academic_records`.`students` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `academic_records`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academic_records`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `lastname` VARCHAR(50) NOT NULL,
  `email` VARCHAR(75) NOT NULL,
  `password` VARCHAR(60) NOT NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `academic_records`.`usercourses`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academic_records`.`usercourses` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `courseCode` VARCHAR(4) NOT NULL,
  `isCreator` TINYINT(1) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_userId_usercourses_idx` (`userId` ASC) VISIBLE,
  INDEX `fk_courseCode_usercourses_idx` (`courseCode` ASC) VISIBLE,
  CONSTRAINT `fk_courseCode_usercourses`
    FOREIGN KEY (`courseCode`)
    REFERENCES `academic_records`.`courses` (`code`)
    ON DELETE RESTRICT,
  CONSTRAINT `fk_userId_usercourses`
    FOREIGN KEY (`userId`)
    REFERENCES `academic_records`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `academic_records`.`gradesheaders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academic_records`.`gradesheaders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `evaluationId` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `points` INT NOT NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` VARCHAR(100) NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  `updatedBy` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_evaluationId_gradesheaders_idx` (`evaluationId` ASC) VISIBLE,
  CONSTRAINT `fk_evaluationId_gradesheaders`
    FOREIGN KEY (`evaluationId`)
    REFERENCES `academic_records`.`evaluations` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `academic_records`.`gradeslines`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academic_records`.`gradeslines` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `gradeHeaderId` INT NOT NULL,
  `studentId` INT NOT NULL,
  `points` INT NOT NULL,
  `feedback` VARCHAR(500) NULL DEFAULT NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` VARCHAR(100) NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  `updatedBy` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_gradeHeaderId_gradeslines_idx` (`gradeHeaderId` ASC) VISIBLE,
  INDEX `fk_studentCedula_gradeslines_idx` (`studentId` ASC) VISIBLE,
  CONSTRAINT `fk_gradeHeaderId_gradeslines`
    FOREIGN KEY (`gradeHeaderId`)
    REFERENCES `academic_records`.`gradesheaders` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_studentId_gradeslines`
    FOREIGN KEY (`studentId`)
    REFERENCES `academic_records`.`students` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `academic_records`.`comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academic_records`.`comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(1000) NOT NULL,
  `createdAt` DATETIME NULL DEFAULT now(),
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `academic_records`.`invitations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `academic_records`.`invitations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `senderId` INT NOT NULL,
  `receptorId` INT NOT NULL,
  `courseCode` VARCHAR(4) NOT NULL,
  `state` VARCHAR(50) NOT NULL,
  `senderName` VARCHAR(100) NOT NULL,
  `courseName` VARCHAR(100) NOT NULL,
  `createAt` DATETIME NULL DEFAULT now(),
  PRIMARY KEY (`id`),
  INDEX `fk_senderId_invitations_idx` (`senderId` ASC) VISIBLE,
  INDEX `fk_receptorId_invitations_idx` (`receptorId` ASC) VISIBLE,
  INDEX `fk_courseCode_invitations_idx` (`courseCode` ASC) VISIBLE,
  CONSTRAINT `fk_senderId_invitations`
    FOREIGN KEY (`senderId`)
    REFERENCES `academic_records`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_receptorId_invitations`
    FOREIGN KEY (`receptorId`)
    REFERENCES `academic_records`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_courseCode_invitations`
    FOREIGN KEY (`courseCode`)
    REFERENCES `academic_records`.`courses` (`code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
