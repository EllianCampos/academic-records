import generateCourseCode from "@/libs/generateCourseCode";
import { prisma } from "@/libs/prisma";
import { courseSchema } from "@/schemas/course.schema";
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

	const courses = await prisma.courses.findMany({
		where: {
			usercourses: {
				some: {
					userId: user.id
				}
			}
		},
		include: {
			usercourses: {
				include: {
					users: {
						select: {
							name: true,
							lastname: true,
							email: true
						}
					}
				}
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	})

	return NextResponse.json(courses)
}

export async function POST(req) {
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

	// Validate request
	let newCourse
	try {
		const body = await req.json()
		newCourse = courseSchema.safeParse(body)
		if (!newCourse.success) {
			return NextResponse.json(newCourse.error)
		}
	} catch (error) {
		return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
	}

	try {
		// Generated course code
		const courseCode = await generateCourseCode()

		// Create
		const course = await prisma.courses.create({
			data: {
				code: courseCode,
				name: newCourse.data.name,
				durationHours: newCourse.data.durationHours,
				numberStudentsEnrolled: 0,
				schedule: newCourse.data.schedule,
				startDate: new Date(newCourse.data.startDate),
				endDate: new Date(newCourse.data.endDate),
				quota: newCourse.data.quota,
				isFinished: newCourse.data.isFinished,
				openEnrollment: newCourse.data.openEnrollment,
				attendacePercentaje: newCourse.data.attendacePercentaje,
				createdBy: `${user.name} ${user.lastname}`
			}
		})

		// Create the reference the course for the user
		const reference = await prisma.usercourses.create({
			data: {
				userId: user.id,
				courseCode,
				isCreator: true
			}
		})

		// Validate if was created
		if (!course || !reference) {
			return NextResponse.json({ errorMessage: 'Error creando el curso' }, { status: 500 })
		}

		return NextResponse.json(course)

	} catch (error) {
		console.log(error)
		return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
	}
}