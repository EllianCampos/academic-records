import { prisma } from "@/libs/prisma";
import { attendanceSchema } from "@/schemas/attendance.schema";
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
		// Get courseCode
		const searchParams = req.nextUrl.searchParams
		const courseCode = searchParams.get("courseCode")
		if (courseCode === null) {
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

		const evaluations = await prisma.attendance.findMany({
			where: {
				courseCode
			}
		})

		return NextResponse.json(evaluations)

	} catch (error) {
		console.log(error)
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
	let newAttendance
	try {
		const body = await req.json()
		newAttendance = attendanceSchema.safeParse(body)
		if (!newAttendance.success) {
			return NextResponse.json(newAttendance.error)
		}
	} catch (error) {
		return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
	}

	try {
		// Validate if the course exists and belongs to the user
		const found = await prisma.usercourses.findFirst({
			where: {
				courseCode: newAttendance.data.courseCode,
				userId: user.id
			}
		})
		if (!found) {
			return NextResponse.json({ errorMessage: 'El curso no existe' }, { statu: 404 })
		}

		// Create
		const attendance = await prisma.attendance.create({
			data: {
				courseCode: newAttendance.data.courseCode,
				description: newAttendance.data.description,
				date: new Date(newAttendance.data.date),
				createdBy: `${user.name} ${user.lastname}`
			}
		})

		// Validate if was created
		if (!attendance) {
			return NextResponse.json({ errorMessage: 'Error creando la asistencia' }, { status: 500 })
		}

		return NextResponse.json(attendance)

	} catch (error) { console.log(error)
		return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
	}
}