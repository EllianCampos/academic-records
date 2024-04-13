import { prisma } from "@/libs/prisma";
import { evaluationSchema } from "@/schemas/evaluation.schema";
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

			const evaluations = await prisma.evaluations.findMany({
					where: {
							courseCode
					}
			})

			return NextResponse.json(evaluations)

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
		const found = await prisma.usercourses.findFirst({
			where: {
				courseCode: newEvaluation.data.courseCode,
				userId: user.id
			}
		})
		if (!found) {
			return NextResponse.json({ errorMessage: 'El curso no existe' }, { statu: 404 })
		}

		// Create
		const evaluation = await prisma.evaluations.create({
			data: {
				courseCode: newEvaluation.data.courseCode,
				name: newEvaluation.data.name,
				percentaje: newEvaluation.data.percentaje,
				points: newEvaluation.data.points,
				isAutoCalculated: newEvaluation.data.isAutoCalculated,
				createdBy: `${user.name} ${user.lastname}`
			}
		})

		// Validate if was created
		if (!evaluation) {
			return NextResponse.json({ errorMessage: 'Error creando la evaluación' }, { status: 500 })
		}

		return NextResponse.json(evaluation)

	} catch (error) {
		return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
	}
}