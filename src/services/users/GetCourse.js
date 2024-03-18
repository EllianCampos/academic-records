import { prisma } from "@/libs/prisma";

export default async function GetCourse(userId, courseCode) {
  const result = await prisma.usercourses.findFirst({
    where: {
      userId,
      courseCode
    }
  })

  if (!result) {
    return ['El curso no existe', null]
  }

  return [null, result]
}