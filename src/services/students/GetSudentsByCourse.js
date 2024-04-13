import { prisma } from "@/libs/prisma";

export default async function GetStudentsByCourse(courseCode) {
  const result = await prisma.enrollment.findMany({
    where: {
      courseCode
    },
    select: {
      students: true
    }
  })

  const students = []
  for (const student of result) {
    students.push(student.students)
  } 

  return students
}