import { prisma } from "@/libs/prisma";
import { attendanceSchema } from "@/schemas/attendance.schema";
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
	let newAttendance
	try {
		const body = await req.json()
		newAttendance = attendanceSchema    .safeParse(body)
		if (!newAttendance.success) {
			return NextResponse.json(newAttendance.error)
		}
	} catch (error) {
		return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
	}

	try {
        // Validate if the course exists and belongs to the user
        const courseFound = await prisma.usercourses.findFirst({
            where: {
                courseCode: newAttendance.data.courseCode,
                userId: user.id
            }
        })
        if (!courseFound) {
            return NextResponse.json({ errorMessage: 'El curso no existe' })
        }

		// Validate if the attendance exists and belongs to the user
		const found = await prisma.attendance.findFirst({
			where: {
                id: Number(params.id),
				courseCode: courseFound.courseCode
			}
		})
		if (!found) {
			return NextResponse.json({ errorMessage: 'La asistencia no existe' }, { statu: 404 })
		}

		// Update
		const attendance = await prisma.attendance.update({
			where: {
				id: found.id
			},
			data: {
				courseCode: newAttendance.data.courseCode,
				description: newAttendance.data.description,
				date: new Date(newAttendance.data.date),
				updatedBy: `${user.name} ${user.lastname}`,
                updatedAt: new Date()
			}
		})

		// Validate if was updated
		if (!attendance) {
			return NextResponse.json({ errorMessage: 'Error actualizando la asistencia' }, { status: 500 })
		}

		return NextResponse.json(attendance)

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

        // Validate if the attendace exists
        const evaluationFound = await prisma.attendance.findFirst({
            where: {
                id: Number(params.id),
                courseCode: courseCode
            }
        })
        if (!evaluationFound) {
            return NextResponse.json({ errorMessage: 'La asistencia no existe' })
        }

        // Delete attendace
        const deleted = await prisma.attendance.delete({
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

        return NextResponse.json({ message: 'Asistencia eliminada exitosamente' })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
    }
}