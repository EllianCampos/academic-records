import { prisma } from "@/libs/prisma";
import { studentSchema } from "@/schemas/student.schema";
import CheckOpenEnrrollment from "@/services/enrollment/CheckOpenEnrrollment";
import CreateStudent from "@/services/students/CreateStudent";
import GetCourseByUser from "@/services/users/GetCourseByUser";
import GetUserFromToken from "@/services/users/GetUserFromToken";
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
        // Validate if the enrollment of the course is open
        const enrollmentIsOpen = await CheckOpenEnrrollment(newStudent.data.courseCode)

        // Case when enrollment is open
        if (enrollmentIsOpen && !newStudent.data.enrolledByTeacher) {
            const result = await CreateStudent('Matriculado por medio del enlace para estudiantes', newStudent)
            if (result[0]) return NextResponse.json({ errorMessage: result[0] }, { status: 500 })
            return NextResponse.json(result[1])            
        }

        // Get user from token
        const user = await GetUserFromToken(req)
        if (user[0] !== null) return NextResponse.json({ errorMessage: user[0] }, { status: 401 }) 

        // Validate if the course exists and belongs to the user
        const course = await GetCourseByUser(user.id, newStudent.data.courseCode)
        if(course[0] !== null) return NextResponse.json({ errorMessage: course[0] }, { status: 404 })

        // Create student
        const result = await CreateStudent(`${user[1].name} ${user[1].lastname}`, newStudent)
        if (result[0]) return NextResponse.json({ errorMessage: result[0] }, { status: 500 })
            
        return NextResponse.json(result[1])            
        
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