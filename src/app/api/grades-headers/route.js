import { prisma } from "@/libs/prisma";
import { gradeSchema } from "@/schemas/grade.schema";
import { gradeHeaderSchema } from "@/schemas/gradeheader.schema";
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
		const evaluationId = searchParams.get("evaluationId")
		if (courseCode === null || evaluationId === null) {
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

		const grades = await prisma.gradesheaders.findMany({
			where: {
				evaluationId: Number(evaluationId)
			}
		})

		return NextResponse.json(grades)

	} catch (error) {
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
	let newGradeHeader
	try {
		const body = await req.json()
		newGradeHeader = gradeHeaderSchema.safeParse(body)
		if (!newGradeHeader.success) {
			return NextResponse.json(newGradeHeader.error)
		}
	} catch (error) {
		return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
	}

	try {
		// Validate if the course exists and belongs to the user
		const found = await prisma.usercourses.findFirst({
			where: {
				courseCode: newGradeHeader.data.courseCode,
				userId: user.id
			}
		})
		if (!found) {
			return NextResponse.json({ errorMessage: 'El curso no existe' }, { statu: 404 })
		}

		// Validate if the evaluation exists and belongs to the course
		const evaluationFound = await prisma.evaluations.findFirst({
			where: {
				id: newGradeHeader.data.evaluationId,
				courseCode: found.courseCode,
			}
		})
		if (!evaluationFound) {
			return NextResponse.json({ errorMessage: 'La evaluación no existe' }, { status: 404 })
		}

		// Create
		const gradeHeader = await prisma.gradesheaders.create({
			data: {
				evaluationId: newGradeHeader.data.evaluationId,
				name: newGradeHeader.data.name,
				points: newGradeHeader.data.points,
				createdBy: `${user.name} ${user.lastname}`
			}
		})

		// Validate if was created
		if (!gradeHeader) {
			return NextResponse.json({ errorMessage: 'Error creando la evaluación' }, { status: 500 })
		}

		return NextResponse.json(gradeHeader)

	} catch (error) {
		return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
	}
}