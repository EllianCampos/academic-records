import { prisma } from "@/libs/prisma";
import { gradeHeaderSchema } from "@/schemas/gradeheader.schema";
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

		// Validate if the grade already exists
		const gradeHeaderFound = await prisma.gradesheaders.findFirst({
			where: {
				evaluationId: newGradeHeader.data.evaluationId,
				id: Number(params.id)
			}
		})
		if (!gradeHeaderFound) {
			return NextResponse.json({ errorMessage: 'La evaluación no existe' }, { status: 400 })
		}

		// Update
		const gradeHeader = await prisma.gradesheaders.update({
			where: {
				id: Number(params.id)
			},
			data: {
				evaluationId: newGradeHeader.data.evaluationId,
				name: newGradeHeader.data.name,
				points: newGradeHeader.data.points,
				updatedBy: `${user.name} ${user.lastname}`,
				updatedAt: new Date()
			}
		})

		// Validate if was created
		if (!gradeHeader) {
			return NextResponse.json({ errorMessage: 'Error creando la evaluación' }, { status: 500 })
		}

		return NextResponse.json(gradeHeader)

	} catch (error) {
		console.log(error)
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

		// Validate if the gradeHeder exists
		const gradeHeaderFound = await prisma.gradesheaders.findFirst({
			where: {
				id: Number(params.id),
				evaluationId: Number(evaluationId)
			}
		})
		if (!gradeHeaderFound) {
			return NextResponse.json({ errorMessage: 'La evaluación no existe' })
		}

		// Delete grade
		const deleted = await prisma.gradesheaders.delete({
			where: {
				id: gradeHeaderFound.id
			}
		})

		// Validate if was deleted
		if (!deleted) {
			return NextResponse.json({
				errorMessage: 'Error al eliminar la evaluación'
			},
				{ status: 400 }
			)
		}

		return NextResponse.json({ message: 'Evaluación eliminada exitosamente' })

	} catch (error) {
		console.log(error)
		return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
	}
}