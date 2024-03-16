// import { reportSchema } from "@/schemas/report.schema";
// import GetReportByStudent from "@/services/reports/reports.servive";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   let courseCode

//   try {
//     const searchParams = req.nextUrl.searchParams
//     courseCode = searchParams.get("courseCode")

//     if (courseCode === null) {
//       return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
//     }
//   } catch (error) {
//     console.log(error)
//     return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
//   }

//   return GetReportByStudent(schema.data.courseCode, schema.data.cedula, schema.data.bornDate)
// }