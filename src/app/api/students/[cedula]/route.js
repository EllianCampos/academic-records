import { prisma } from "@/libs/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
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
	    if (params.cedula == null) return NextResponse.json({ errorMessage: "Acción no válida" }, { status: 400 })

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

        const students = await prisma.students.findFirst({
            where: {
                enrollment: {
                    every: {
                        courseCode,
                        studentCedula: Number(params.cedula)
                    }
                }
            }
        })

        // Validate if was found
        if (!students) {
            return NextResponse.json({ 
                errorMessage: 'Estudiante no encontrado' }, 
                { status: 400 }
            )
        }

        return NextResponse.json(students)

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
	    if (params.cedula == null) return NextResponse.json({ errorMessage: "Acción no válida" }, { status: 400 })

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

        // Validate if the student exists
        const studentFound = await prisma.enrollment.findFirst({
            where: {
                studentCedula: Number(params.cedula),
                courseCode: courseCode
            }
        })
        if (!studentFound) {
            return NextResponse.json({ errorMessage: 'El estudiante no existe' })
        }

        // Delete student
        const deleted = await prisma.students.delete({
            where: {
                id: studentFound.studentId
            }
        })

        // decrement count students enrrolleds
        const count = await prisma.courses.update({
            where: {
                code: courseFound.courseCode
            },
            data: {
                numberStudentsEnrolled: {
                    decrement: 1
                }
            }
        })

        // Validate if was deleted
        if (!deleted || !count) {
            return NextResponse.json({ 
                errorMessage: 'Error al eliminar el estudiante' }, 
                { status: 400 }
            )
        }

        return NextResponse.json({ message: 'Estudiante eliminado exitosamente' })

    } catch (error) {
        return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
    }
}