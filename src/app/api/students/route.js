import { prisma } from "@/libs/prisma";
import { studentSchema } from "@/schemas/student.schema";
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

        // const students = await prisma.students.findMany({
        //     where: {
        //         enrollment: {
        //             every: {
        //                 courseCode: courseCode
        //             }
        //         }
        //     }
        // })

        const students = await prisma.enrollment.findMany({
            where: {
               courseCode 
            },
            select: {
                students: true
            },
            orderBy: {
                students: {
                    lastname: 'asc'
                }
            }
        })

        let result = []
        for (const iterator of students) {
            result.push(iterator.students)
        }

        return NextResponse.json(result)

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
        return NextResponse.json({
            errorMessage: 'Acceso NO autorizado'
        }, { status: 401 });
    }

    // Validate request
    let newStudent
    try {
        const body = await req.json()
        newStudent = studentSchema.safeParse(body)
        if (!newStudent.success) {
            return NextResponse.json(newStudent.error)
        }
    } catch (error) {
        return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
    }

    try {
        // Validate if the course exists and belongs to the user
        const courseFound = await prisma.usercourses.findFirst({
            where: {
                courseCode: newStudent.data.courseCode,
                userId: user.id
            },
            include: {
                courses: true
            }
        })
        if (!courseFound) {
            return NextResponse.json({ errorMessage: 'El curso no existe' })
        }

        // Validate if the student exists
        const studentFound = await prisma.enrollment.findFirst({
            where: {
                studentCedula: newStudent.data.cedula,
                courseCode: newStudent.data.courseCode
            }
        })
        if (studentFound) {
            return NextResponse.json({ errorMessage: 'El estudiante ya ha sido registrado' })
        }

        // validate if there is space left in the course
        if (courseFound.courses.numberStudentsEnrolled >= courseFound.courses.quota) {
            return NextResponse.json({ errorMessage: 'El curso ha alcanzado la cantidad máxima de estudiantes matriuclados' })
        }

        // Create
        const student = await prisma.students.create({
            data: {
                cedula: newStudent.data.cedula,
                name: newStudent.data.name,
                lastname: newStudent.data.lastname,
                bornDate: new Date(newStudent.data.bornDate),
                gender: newStudent.data.gender,
                phone: newStudent.data.phone,
                email: newStudent.data.email,
                disability: newStudent.data.disability,
                disabilityDescription: newStudent.data.disabilityDescription,
                provincia: newStudent.data.provincia,
                canton: newStudent.data.canton,
                distrito: newStudent.data.distrito,
                comunidad: newStudent.data.comunidad,
                observations: newStudent.data.observations,
                createdBy: `${user.name} ${user.lastname}`
            }
        })

        // Create the enrollment
        const enrollment = await prisma.enrollment.create({
            data: {
                courseCode: courseFound.courseCode,
                studentId: student.id,
                studentCedula: student.cedula,
                createdBy: `${user.name} ${user.lastname}`
            }
        })

        // add count students enrrolleds
        const count = await prisma.courses.update({
            where: {
                code: courseFound.courseCode
            },
            data: {
                numberStudentsEnrolled: {
                    increment: 1
                }
            }
        })

        // Validate if was created
        if (!student || !enrollment || !count) {
            return NextResponse.json({ errorMessage: 'Error registrando el estudiante' }, { status: 500 })
        }

        return NextResponse.json(student)

    } catch (error) {
        console.log(error)
        return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
    }
}

export async function PUT(req) {
    // Validate if the request contains a token
	let user = {}
	try {
		let token = await getToken({ req })
		user = token.user
	} catch (error) {
		return NextResponse.json({ errorMessage: 'Acceso NO autorizado' }, { status: 401 });
	}

	// Validate request
	let newStudent
	try {
		const body = await req.json()
		newStudent = studentSchema.safeParse(body)
		if (!newStudent.success) {
			return NextResponse.json(newStudent.error)
		}
	} catch (error) {
		return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
	}

	try {
		// Validate if the course exists and belongs to the user
		const found = await prisma.usercourses.findFirst({
			where: {
				courseCode: newStudent.data.courseCode,
				userId: user.id
			}
		})
		if (!found) {
			return NextResponse.json({ errorMessage: 'El curso no existe' }, { statu: 404 })
		}

        // Validate if the student exists
        const studentFound = await prisma.enrollment.findFirst({
            where: {
                studentCedula: newStudent.data.cedula,
                courseCode: newStudent.data.courseCode
            }
        })
        if (!studentFound) {
            return NextResponse.json({ errorMessage: 'El estudiante no existe' })
        }

		// Update
		const student= await prisma.students.update({
			where: {
				id: studentFound.studentId
			},
			data: {
                name: newStudent.data.name,
                lastname: newStudent.data.lastname,
                bornDate: new Date(newStudent.data.bornDate),
                gender: newStudent.data.gender,
                phone: newStudent.data.phone,
                email: newStudent.data.email,
                disability: newStudent.data.disability,
                disabilityDescription: newStudent.data.disabilityDescription,
                provincia: newStudent.data.provincia,
                canton: newStudent.data.canton,
                distrito: newStudent.data.distrito,
                comunidad: newStudent.data.comunidad,
                observations: newStudent.data.observations,
				updatedBy: `${user.name} ${user.lastname}`,
				updatedAt: new Date()
			}
		})

		// Validate if was updated
		if (!student) {
			return NextResponse.json({ errorMessage: 'Error actualizando los datos del estudiante' }, { status: 500 })
		}

		return NextResponse.json(student)

	} catch (error) {
		console.log(error)
		return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
	}
}