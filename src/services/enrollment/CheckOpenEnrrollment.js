import { prisma } from "@/libs/prisma";
import GetCourseByCode from "../courses/GetCourseByCode";

export default async function CheckOpenEnrrollment(courseCode) {
  const course = await GetCourseByCode(courseCode)

  if (!course) return false

  return course.openEnrollment
}