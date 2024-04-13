import { prisma } from "@/libs/prisma";
import { evaluationSchema } from "@/schemas/evaluation.schema";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { number } from "zod";

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
	let newEvaluation
	try {
		const body = await req.json()
		newEvaluation = evaluationSchema.safeParse(body)
		if (!newEvaluation.success) {
			return NextResponse.json(newEvaluation.error)
		}
	} catch (error) {
		return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
	}

	try {
        // Validate if the course exists and belongs to the user
        const courseFound = await prisma.usercourses.findFirst({
            where: {
                courseCode: newEvaluation.data.courseCode,
                userId: user.id
            }
        })
        if (!courseFound) {
            return NextResponse.json({ errorMessage: 'El curso no existe' })
        }

		// Validate if the evaluations exists and belongs to the user
		const found = await prisma.evaluations.findFirst({
			where: {
                id: Number(params.id),
				courseCode: courseFound.courseCode
			}
		})
		if (!found) {
			return NextResponse.json({ errorMessage: 'La evaluación no existe' }, { statu: 404 })
		}

		// Update
		const evaluation = await prisma.evaluations.update({
			where: {
				id: found.id
			},
			data: {
				courseCode: newEvaluation.data.courseCode,
				name: newEvaluation.data.name,
				percentaje: newEvaluation.data.percentaje,
				points: newEvaluation.data.points,
				isAutoCalculated: newEvaluation.data.isAutoCalculated,
				updatedBy: `${user.name} ${user.lastname}`,
                updatedAt: new Date()
			}
		})

		// Validate if was updated
		if (!evaluation) {
			return NextResponse.json({ errorMessage: 'Error actualizando la evaluación' }, { status: 500 })
		}

		return NextResponse.json(evaluation)

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

        // Validate if the evaluation exists
        const evaluationFound = await prisma.evaluations.findFirst({
            where: {
                id: Number(params.id),
                courseCode: courseCode
            }
        })
        if (!evaluationFound) {
            return NextResponse.json({ errorMessage: 'La evaluación no existe' })
        }

        // Delete evaluation
        const deleted = await prisma.evaluations.delete({
            where: {
                id: evaluationFound.id
            }
        })

        // Validate if was deleted
        if (!deleted) {
            return NextResponse.json({ 
                errorMessage: 'Error al eliminar la evaluación' }, 
                { status: 400 }
            )
        }

        return NextResponse.json({ message: 'Evaluación eliminada exitosamente' })

    } catch (error) {
        return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
    }
}