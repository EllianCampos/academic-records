import GetCourseByCode from "./GetCourseByCode";

export default async function ValidateQuota(courseCode) {
  const course = await GetCourseByCode(courseCode)
  return course.numberStudentsEnrolled < course.quota 
}