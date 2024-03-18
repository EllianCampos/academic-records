import { reportSchema } from "@/schemas/report.schema";
import GetReportByStudent from "@/services/reports/GetReportByStudent";
import { NextResponse } from "next/server";

export async function GET(req) {
  let courseCode, studentCedula, studentBornDate

  try {
    const searchParams = req.nextUrl.searchParams
    courseCode = searchParams.get("courseCode")
    studentCedula = searchParams.get("studentCedula")
    studentBornDate = searchParams.get("studentBornDate")

    if (courseCode === null || studentCedula === null || studentBornDate === null) {
      return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
  }

  const schema = reportSchema.safeParse({ courseCode, cedula: Number(studentCedula), bornDate: studentBornDate })
  if (!schema.success) {
    return NextResponse.json(schema.error)
  }

  const report = await GetReportByStudent(schema.data.courseCode, schema.data.cedula, schema.data.bornDate)
  return NextResponse.json(report)
}