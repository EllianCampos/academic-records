import { NextResponse } from "next/server";
import GetStudentByBasicData from "./students.services";
import { prisma } from "@/libs/prisma";

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
  const studentReport = {...data.students}
  delete studentReport.createdAt
  delete studentReport.createdBy
  delete studentReport.updatedAt
  delete studentReport.updatedBy

  // Declare note variable
  let note = 0

  // Generante grades
  let gradesReport = []
  for (const item of data.courses.evaluations) {
    if (!item.isAutoCalculated) {
      const totalPoints = Number(item.points)
      const totalPercentaje = Number(item.percentaje)
      const gettedPoints = Number(item.grades[0].points)

      const gettedPercentaje = (totalPercentaje * gettedPoints) / totalPoints
      const gettedNote = (gettedPoints * 100) / totalPoints

      const grade = {
        name: item.name,
        totalPoints,
        gettedPoints,
        totalPercentaje: totalPercentaje.toFixed(0),
        gettedPercentaje: gettedPercentaje.toFixed(2),
        gettedNote: gettedNote.toFixed(2),
        feedback: item.grades[0].feedback
      }

      note += gettedPercentaje
      gradesReport.push(grade)
    } else {
      const totalPercentaje = Number(item.percentaje) / Number(item._count.gradesheaders)

      for (const header of item.gradesheaders) {
        if (header.gradeslines[0] != null) {
          const totalPoints = Number(header.points)
          const gettedPoints = Number(header.gradeslines[0].points)

          const gettedPercentaje = (totalPercentaje * gettedPoints) / totalPoints
          const gettedNote = (gettedPoints * 100) / totalPoints

          const grade = {
            name: header.name,
            totalPoints,
            gettedPoints,
            totalPercentaje: totalPercentaje.toFixed(2),
            gettedPercentaje: gettedPercentaje.toFixed(2),
            gettedNote: gettedNote.toFixed(2),
            feedback: header.gradeslines[0].feedback
          }

          note += gettedPercentaje
          gradesReport.push(grade)
        }
      }
    }
  }

  // Generate attendande report
  let attendanceReport = {}
  attendanceReport.attendance = []
  const totalAttendancePercentaje = Number(data.courses.attendacePercentaje)
  const countAttendace = Number(data.courses._count.attendance)
  let presentClasess = 0

  for (const item of data.courses.attendance) {
    if (item.attendancelines[0] != null) {
      let state = item.attendancelines[0].state

      if (state != 'AUSENTE') {
        presentClasess++
      }

      const attendanceLine = {
        description: item.description,
        date: item.date,
        state: item.attendancelines[0].state,
        observations: item.attendancelines[0].observations
      }

      attendanceReport.attendance.push({attendanceLine})
    }
  }

  const attendacePercentaje = (totalAttendancePercentaje * presentClasess) / countAttendace
  attendanceReport.percentaje = attendacePercentaje
  note += attendacePercentaje

  return NextResponse.json([courseReport, studentReport, gradesReport, attendanceReport, Math.round(note)])
  // return NextResponse.json(data)
}