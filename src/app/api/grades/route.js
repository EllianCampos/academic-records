import { prisma } from "@/libs/prisma";
import { gradeSchema } from "@/schemas/grade.schema";
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

		// const grades = await prisma.grades.findMany({
		// 	where: {
		// 		evaluationId: Number(evaluationId)
		// 	}
		// })

		const grades = await prisma.students.findMany({
			where: {
				enrollment: {
					some: {
						courseCode: courseCode
					}
				}
			},
			include: {	
				grades: {
					where: {
						evaluationId: Number(evaluationId)
					}
				}
			},
			orderBy: {
				lastname: 'asc'
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
	let newGrade
	try {
		const body = await req.json()
		newGrade = gradeSchema.safeParse(body)
		if (!newGrade.success) {
			return NextResponse.json(newGrade.error)
		}
	} catch (error) {
		return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
	}

	try {
		// Validate if the course exists and belongs to the user
		const found = await prisma.usercourses.findFirst({
			where: {
				courseCode: newGrade.data.courseCode,
				userId: user.id
			}
		})
		if (!found) {
			return NextResponse.json({ errorMessage: 'El curso no existe' }, { statu: 404 })
		}

		// Validate if the evaluation exists and belongs to the course
		const evaluationFound = await prisma.evaluations.findFirst({
			where: {
				id: newGrade.data.evaluationId,
				courseCode: found.courseCode,
			}
		})
		if (!evaluationFound) {
			return NextResponse.json({ errorMessage: 'La evaluación no existe' }, { status: 404 })
		}

		// Validate if the grade already exists
		const gradeFound = await prisma.grades.findFirst({
			where: {
				studentId: newGrade.data.studentId,
				evaluationId: newGrade.data.evaluationId
			}
		})
		if (gradeFound) {
			return NextResponse.json({ errorMessage: 'La calificación ya existe' }, { status: 400 })
		}

		// Validate if the student exists and belongs to the course
		const studentFound = await prisma.enrollment.findFirst({
			where: {
				courseCode: newGrade.data.courseCode,
				studentId: newGrade.data.studentId
			}
		})
		if (!studentFound) {
			return NextResponse.json({ errorMessage: 'El estudiante no existe' }, { status: 404 })
		}

		// Create
		const grade = await prisma.grades.create({
			data: {
				studentId: newGrade.data.studentId,
				evaluationId: newGrade.data.evaluationId,
				points: newGrade.data.points,
				feedback: newGrade.data.feedback,
				createdBy: `${user.name} ${user.lastname}`
			}
		})

		// Validate if was created
		if (!grade) {
			return NextResponse.json({ errorMessage: 'Error creando la calificación' }, { status: 500 })
		}

		return NextResponse.json(grade)

	} catch (error) {
		return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
	}
}