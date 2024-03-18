import GetReportByCourse from "@/services/reports/GetReportByCourse";
import GetUserFromToken from "@/services/users/GetUserFromToken";
import { NextResponse } from "next/server";

export async function GET(req) {
  let courseCode

  // user
  const user = await GetUserFromToken(req)
  if (user[0] !== null) return NextResponse.json({ errorMessage: user[0] }, { status: 401 })

  // course code
  try {
    const searchParams = req.nextUrl.searchParams
    courseCode = searchParams.get("courseCode")

    if (courseCode === null) {
      return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
  }

  const report = await GetReportByCourse(user.id, courseCode)
  return NextResponse.json(report)
}