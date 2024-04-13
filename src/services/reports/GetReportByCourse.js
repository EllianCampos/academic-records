import { prisma } from "@/libs/prisma";
import GetCourse from "../users/GetCourseByUser";
import GetStudentsByCourse from "../students/GetSudentsByCourse";
import { NextResponse } from "next/server";
import GetReportByStudent from "./GetReportByStudent";

export default async function GetReportByCourse(userId, courseCode) {
  const course = await GetCourse(userId, courseCode)
  if (course[0] != null) return NextResponse.json({ errorMessage: course[0] }, { status: 404 })

  const students = await GetStudentsByCourse(courseCode)

  let report = []
  for (const student of students) {
    const reportByStudent = await GetReportByStudent(courseCode, student.cedula, student.bornDate)
    // console.log(reportByStudent)
    report.push(reportByStudent)
  }

  // const report = await GetReportByStudent(courseCode, students[0].cedula, students[0].bornDate)

  return report
}