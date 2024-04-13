import { prisma } from "@/libs/prisma"
import GetStudentByCedulaAndCourse from "./GetStudentByCedulaAndCourse"
import ValidateQuota from "../courses/ValidateQuota"

export default async function CreateStudent(creator, newStudent) {
  // Validate if the student exists
  const studentFound = await GetStudentByCedulaAndCourse(newStudent.data.cedula, newStudent.data.courseCode)
  if (studentFound) {
    return ['El estudiante ya ha sido registrado', null]
  }

  // validate if there is space left in the course
  const quotaResult = await ValidateQuota(newStudent.data.courseCode)
  if (!quotaResult) {
    return ['El curso ha alcanzado la cantidad máxima de estudiantes matriuclados', null]
  }

  // Create
  const student = await prisma.students.create({
    data: {
      cedula: newStudent.data.cedula,
      name: newStudent.data.name,
      lastname: newStudent.data.lastname,
      bornDate: new Date(newStudent.data.bornDate),
      gender: newStudent.data.gender,
      phone: newStudent.data.phone,
      email: newStudent.data.email,
      disability: newStudent.data.disability,
      disabilityDescription: newStudent.data.disabilityDescription,
      provincia: newStudent.data.provincia,
      canton: newStudent.data.canton,
      distrito: newStudent.data.distrito,
      comunidad: newStudent.data.comunidad,
      observations: newStudent.data.observations,
      createdBy: creator
    }
  })

  // Create the enrollment
  const enrollment = await prisma.enrollment.create({
    data: {
      courseCode: newStudent.data.courseCode,
      studentId: student.id,
      studentCedula: student.cedula,
      createdBy: creator
    }
  })

  // add count students enrrolleds
  const count = await prisma.courses.update({
    where: {
      code: newStudent.data.courseCode
    },
    data: {
      numberStudentsEnrolled: {
        increment: 1
      }
    }
  })

  // Validate if was created
  if (!student || !enrollment || !count) {
    return ['Error registrando el estudiante', null]
  }

  return [null, 'Matriculado exitosamente']
}