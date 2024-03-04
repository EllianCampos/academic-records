import { prisma } from "@/libs/prisma";
import { attendanceLineSchema } from "@/schemas/attendanceLine.schema";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
	// Validate if the request contains a token
	let user = {}
	try {
		let token = await getToken({ req })
		user = token.user
	} catch (error) {
		return NextResponse.json({
			errorMessage: 'Acceso NO autorizado'
		}, { status: 401 });
	}

	try {
		// Search Params
		const searchParams = req.nextUrl.searchParams
		const courseCode = searchParams.get("courseCode")
		const attendanceId = searchParams.get("attendanceId")
		if (courseCode === null || attendanceId === null) {
			return NextResponse.json({ errorMessage: 'Formato de peticion no valido' })
		}

		// Validate if the course exists and belongs to the user
		const courseFound = await prisma.usercourses.findFirst({
			where: {
				courseCode: courseCode,
				userId: user.id
			}
		})
		if (!courseFound) {
			return NextResponse.json({ errorMessage: 'El curso no existe' })
		}

		const attendancelines = await prisma.attendancelines.findMany({
			where: {
				attendaceId: Number(attendanceId)
			}
		})

		return NextResponse.json(attendancelines)

	} catch (error) { console.log(error)
		return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
	}
}

export async function POST(req) {
	// Validate if the request contains a token
	let user = {}
	try {
		let token = await getToken({ req })
		user = token.user
	} catch (error) {
		return NextResponse.json({ errorMessage: 'Acceso NO autorizado' }, { status: 401 });
	}

	// Validate request
	let newAttendanceLine
	try {
		const body = await req.json()
		newAttendanceLine = attendanceLineSchema.safeParse(body)
		if (!newAttendanceLine.success) {
			return NextResponse.json(newAttendanceLine.error)
		}
	} catch (error) {
		return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
	}

	try {
		// Validate if the course exists and belongs to the user
		const found = await prisma.usercourses.findFirst({
			where: {
				courseCode: newAttendanceLine.data.courseCode,
				userId: user.id
			}
		})
		if (!found) {
			return NextResponse.json({ errorMessage: 'El curso no existe' }, { statu: 404 })
		}

		// Validate if the attendance exists and belongs to the course
		const evaluationFound = await prisma.attendance.findFirst({
			where: {
				id: newAttendanceLine.data.attendanceId,
				courseCode: found.courseCode,
			}
		})
		if (!evaluationFound) {
			return NextResponse.json({ errorMessage: 'La lista de asistencia no existe' }, { status: 404 })
		}

		// Validate if the attendancelines already exists
		const gradeFound = await prisma.attendancelines.findFirst({
			where: {
				studentId: newAttendanceLine.data.studentId,
				attendaceId: newAttendanceLine.data.attendanceId
			}
		})
		if (gradeFound) {
			return NextResponse.json({ errorMessage: 'La asistencia ya existe' }, { status: 400 })
		}

		// Validate if the student exists and belongs to the course
		const studentFound = await prisma.enrollment.findFirst({
			where: {
				courseCode: newAttendanceLine.data.courseCode,
				studentId: newAttendanceLine.data.studentId
			}
		})
		if (!studentFound) {
			return NextResponse.json({ errorMessage: 'El estudiante no existe' }, { status: 404 })
		}

		// Create
		const attendanceLine = await prisma.attendancelines.create({
			data: {
				attendaceId: newAttendanceLine.data.attendanceId,
				studentId: newAttendanceLine.data.studentId,
				state: newAttendanceLine.data.state,
				observations: newAttendanceLine.data.observations,
				createdBy: `${user.name} ${user.lastname}`
			}
		})

		// Validate if was created
		if (!attendanceLine) {
			return NextResponse.json({ errorMessage: 'Error creando la asistencia' }, { status: 500 })
		}

		return NextResponse.json(attendanceLine)

	} catch (error) {
		console.log(error)
		return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
	}
}