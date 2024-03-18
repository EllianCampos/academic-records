import { NextResponse } from "next/server";
import GetStudentByBasicData from "../students.js/students.services";
import { prisma } from "@/libs/prisma";
import GetGradesReport from "./GetGradesReport";
import GetAttendanceReport from "./GetAttendanceReport";

export default async function GetReportByStudent(courseCode, studentCedula, studentBornDate) {
  // Search student
  const student = await GetStudentByBasicData(courseCode, studentCedula, studentBornDate)
  if (student[0]) return NextResponse.json({ errorMessage: student[0] }, { status: 400 })

  // Search students grades
  const data = await prisma.enrollment.findFirst({
    where: {
      studentCedula: Number(studentCedula),
      courseCode: courseCode
    },
    include: {
      students: true,
      courses: {
        include: {
          evaluations: {
            include: {
              _count: {
                select: {
                  gradesheaders: true
                }
              },
              grades: {
                where: {
                  students: {
                    cedula: Number(studentCedula)
                  }
                }
              },
              gradesheaders: {
                include: {
                  gradeslines: {
                    where: {
                      students: {
                        cedula: Number(studentCedula)
                      }
                    }
                  }
                }
              }
            }
          },
          _count: {
            select: {
              attendance: true
            }
          },
          attendance: {
            include: {
              attendancelines: {
                where: {
                  students: {
                    cedula: Number(studentCedula)
                  }
                }
              }
            }
          }
        }
      }
    }
  })

  // return NextResponse.json(data)

  // Course information
  const courseReport = { ...data.courses }
  delete courseReport.evaluations
  delete courseReport.attendance
  delete courseReport._count
  delete courseReport.createdAt
  delete courseReport.createdBy
  delete courseReport.updatedAt
  delete courseReport.updatedBy

  // Student information
  const studentReport = { ...data.students }
  delete studentReport.createdAt
  delete studentReport.createdBy
  delete studentReport.updatedAt
  delete studentReport.updatedBy

  // Generante grades
  const grades = GetGradesReport(data)
  const gradesReport = grades[0]

  // Generate attendande report
  const attendance = GetAttendanceReport(data)
  const attendanceReport = attendance[0]

  // Note
  let note = 0
  note = Number(grades[1]) + attendance[1]

  return [
    courseReport,
    studentReport,
    gradesReport,
    attendanceReport,
    note // Math.round(note)]
  ]
}