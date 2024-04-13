import { prisma } from "@/libs/prisma";

export default async function GetCourseByCode(courseCode){
  const course = await prisma.courses.findUnique({
    where: {
      code: courseCode
    }
  })
  
  return course
}