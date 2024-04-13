import { prisma } from "@/libs/prisma";
import { gradeLineSchema } from "@/schemas/gradeline.schema";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
	// Validate if the request contains a token
	let user = {}
	try {
		let token = await getToken({ req })
		user = token.user
	} catch (error) {
		return NextResponse.json({ errorMessage: 'Acceso NO autorizado' }, { status: 401 });
	}

	// Check the params
	if (params.id == null) return NextResponse.json({ errorMessage: "Acción no válida" }, { status: 400 })

	// Validate request
	let newGradeLine
	try {
		const body = await req.json()
		newGradeLine = gradeLineSchema.safeParse(body)
		if (!newGradeLine.success) {
			return NextResponse.json(newGradeLine.error)
		}
	} catch (error) {
		return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
	}

	try {
		// Validate if the course exists and belongs to the user
		const found = await prisma.usercourses.findFirst({
			where: {
				courseCode: newGradeLine.data.courseCode,
				userId: user.id
			}
		})
		if (!found) {
			return NextResponse.json({ errorMessage: 'El curso no existe' }, { statu: 404 })
		}

		// Validate if the header exists and belongs to the course
		const evaluationFound = await prisma.gradesheaders.findFirst({
			where: {
				id: newGradeLine.data.gradeHeaderId
			}
		})
		if (!evaluationFound) {
			return NextResponse.json({ errorMessage: 'La evaluación no existe' }, { status: 404 })
		}

		// Validate if the gradeline already exists
		const gradeLineFound = await prisma.gradeslines.findFirst({
			where: {
				studentId: newGradeLine.data.studentId,
				gradeHeaderId: newGradeLine.data.gradeHeaderId
			}
		})
		if (!gradeLineFound) {
			return NextResponse.json({ errorMessage: 'La calificación no existe' }, { status: 400 })
		}

		// Validate if the student exists and belongs to the course
		const studentFound = await prisma.enrollment.findFirst({
			where: {
				courseCode: newGradeLine.data.courseCode,
				studentId: newGradeLine.data.studentId
			}
		})
		if (!studentFound) {
			return NextResponse.json({ errorMessage: 'El estudiante no existe' }, { status: 404 })
		}

		// Update
		const gradeLine = await prisma.gradeslines.update({
			where: {
				id: Number(params.id)
			},
			data: {
				studentId: newGradeLine.data.studentId,
				gradeHeaderId: newGradeLine.data.gradeHeaderId,
				points: newGradeLine.data.points,
				feedback: newGradeLine.data.feedback,
				updatedBy: `${user.name} ${user.lastname}`,
				updatedAt: new Date()
			}
		})

		// Validate if was created
		if (!gradeLine) {
			return NextResponse.json({ errorMessage: 'Error creando la calificación' }, { status: 500 })
		}

		return NextResponse.json(gradeLine)

	} catch (error) {
		return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
	}
}


export async function DELETE(req, { params }) {
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
		// Check the params
		if (params.id == null) return NextResponse.json({ errorMessage: "Acción no válida" }, { status: 400 })

		// Search Params
		const searchParams = req.nextUrl.searchParams
		const courseCode = searchParams.get("courseCode")
		const gradeHeaderId = searchParams.get("gradeHeaderId")
		if (courseCode === null || gradeHeaderId === null) {
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

		// Validate if the gradeline already exists
		const gradeLineFound = await prisma.gradeslines.findFirst({
			where: {
				id: Number(params.id),
				gradeHeaderId: Number(gradeHeaderId)
			}
		})
		if (!gradeLineFound) {
			return NextResponse.json({ errorMessage: 'La calificación no existe' }, { status: 400 })
		}

		// Delete gradeline
		const deleted = await prisma.gradeslines.delete({
			where: {
				id: gradeLineFound.id
			}
		})

		// Validate if was deleted
		if (!deleted) {
			return NextResponse.json({
				errorMessage: 'Error al eliminar la calificación'
			},
				{ status: 400 }
			)
		}

		return NextResponse.json({ message: 'Calificación eliminada exitosamente' })

	} catch (error) {
		return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
	}
}