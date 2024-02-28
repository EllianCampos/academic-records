USE academic_records;

INSERT INTO users (name, lastname, email, password) 
VALUES
	('Usuario', 'Publico de prueba', 'test@user.com', '$2a$12$v62FwyYX.WTeHFY7aAbDw.HM0Z9GAPrvNbaiYRttIneFz4MdV4d8a'), -- pass = test
    ('Usuario', 'Secundario de prueba de prueba', 'secundario@test.com', '$2a$12$91SrMfHih//K1wqAXiMYJOoYIA2ThRIPJ8xIV1OmjpPpx.GCeeTH.'), -- pass = test
    ('Ellian Gabriel', 'Campos Ceciliano', 'ellian.campos12@gmail.com', '$2a$12$oLAmMA4ydGZeAGAMxGuYZ.Qz6ECsMeXfQKIP0mN9mxdfHpyXX7UO2'); -- pass = 123

SELECT * FROM users;
SELECT * FROM courses;
SELECT * FROM usercourses;
SELECT * FROM comments;
SELECT * FROM invitations;
SELECT * FROM students;
SELECT * FROM enrollment;
SELECT * FROM evaluations;
SELECT * FROM grades;