USE academic_records;

-- Consultas de prueba Registro estudiantil
SELECT * FROM users;
SELECT * FROM courses;

INSERT INTO `academic_records`.`courses` (`code`,`name`,`durationHours`,`numberStudentsEnrolled`,`schedule`,`quota`)
VALUES ('aaaa', 'C#', '40', '15', 'Horario', 20);

INSERT INTO evaluations (courseCode, name, percentaje, points, isAutoCalculated)
VALUES 
	('aaaa', 'Parcial 1', 3, 45, 0);

