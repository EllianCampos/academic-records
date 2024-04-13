import { prisma } from "@/libs/prisma";
import { courseSchema } from "@/schemas/course.schema";
import { getToken } from "next-auth/jwt";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
	// Validate if the request contains a token
	let user = {}
	try {
		let token = await getToken({ req })
		user = token.user
	} catch (error) {
		return NextResponse.json({ errorMessage: 'Acceso NO autorizado' }, { status: 401 });
	}

	// Check the params
	if (params.code == null) return NextResponse.json({ errorMessage: "Acción no válida" }, { status: 400 })

	let courses = await prisma.usercourses.findFirst({
		where: {
			userId: user.id,
			courseCode: params.code
		},
		select: {
			isCreator: true,
			courses: {
				select: {
					code: true,
					name: true,
					durationHours: true,
					numberStudentsEnrolled: true,
					schedule: true,
					startDate: true,
					endDate: true,
					quota: true,
					isFinished: true,
					attendacePercentaje: true,
					createdAt: true,
					createdBy: true,
					updatedAt: true,
					updatedBy: true,
					openEnrollment: true,
				}
			},

		}
	},
	);

	if (!courses) {
		return NextResponse.json({ errorMessage: 'Acceso NO autorizado' }, { status: 401 });
	}

	const teachers = await prisma.usercourses.findMany({
		where: {
			courseCode: params.code
		},
		select: {
			users: {
				select: {
					id: true,
					name: true,
					lastname: true,
					email: true,
				}
			},
			isCreator: true
		}
	})

	const teachersData = []
	for (const teacher of teachers) {
		teachersData.push({
			id: teacher.users.id,
			fullname: teacher.users.name + ' ' + teacher.users.lastname,
			email: teacher.users.email,
			isCreator: teacher.isCreator
		})
	}

	courses.teachers = teachersData

	return NextResponse.json(courses)
}

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
	if (params.code == null) return NextResponse.json({ errorMessage: "Acción no válida" }, { status: 400 })

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
		// Validate if the element exists and belongs to the user
		const found = await prisma.usercourses.findFirst({
			where: {
				courseCode: params.code,
				userId: user.id
			}
		})
		if (!found) {
			return NextResponse.json({ errorMessage: 'El curso no existe' }, { statu: 404 })
		}

		// Update
		const course = await prisma.courses.update({
			where: {
				code: params.code
			},
			data: {
				name: newCourse.data.name,
				durationHours: newCourse.data.durationHours,
				schedule: newCourse.data.schedule,
				startDate: new Date(newCourse.data.startDate),
				endDate: new Date(newCourse.data.endDate),
				quota: newCourse.data.quota,
				isFinished: newCourse.data.isFinished,
				attendacePercentaje: newCourse.data.attendacePercentaje,
				openEnrollment: newCourse.data.openEnrollment,
				updatedBy: `${user.name} ${user.lastname}`,
				updatedAt: new Date()
			}
		})

		// Validate if was updated
		if (!course) {
			return NextResponse.json({ errorMessage: 'Error actualizando el curso' }, { status: 500 })
		}

		return NextResponse.json(course)

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
		return NextResponse.json({ errorMessage: 'Acceso NO autorizado' }, { status: 401 });
	}

	// Check the params
	if (params.code == null) return NextResponse.json({ errorMessage: "Acción no válida" }, { status: 400 })

	try {
		// Validate if the element exists and belongs to the user
		const found = await prisma.usercourses.findFirst({
			where: {
				courseCode: params.code,
				userId: user.id
			}
		})
		if (!found) {
			return NextResponse.json({ errorMessage: 'El curso no existe' }, { statu: 404 })
		}

		// Validate if the user is not the creator of cuorse for leave the course
		if (!found.isCreator) {
			const referenceDelted = await prisma.usercourses.delete({
				where: {
					id: found.id
				}
			})

			if (!referenceDelted) {
				return NextResponse.json({ errorMessage: 'Ha ocurrido un error abandonando el curso' }, { status: 500 })
			}

			return NextResponse.json({ message: 'Ya no formas parte del curso pero puede solicitar el creado que te invite nuevamente' })
		}

		// Delete the refereces for the course
		const reference = await prisma.usercourses.deleteMany({
			where: {
				courseCode: params.code
			}
		})

		// Delete
		const deleted = await prisma.courses.delete({
			where: {
				code: params.code
			}
		})

		// Validate if was deleted
		if (!deleted || !reference) {
			return NextResponse.json({
				errorMessage: 'Error al eliminar el curso'
			},
				{ status: 400 }
			)
		}

		return NextResponse.json({ message: 'Curso eliminado exitosamente' })

	} catch (error) {
		console.log(error)
		return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
	}
}