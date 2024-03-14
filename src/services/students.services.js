import { prisma } from "@/libs/prisma";

export default async function GetStudentByBasicData(courseCode, studentCedula, studentBornDate) {
  const student = await prisma.enrollment.findFirst({
    where: {
      studentCedula: Number(studentCedula),
      courseCode,
      students: {
        bornDate: new Date(studentBornDate)
      }
    }
  })

  if (!student)
    return ['No se encontraron registros', null]

  return [null, student]
}