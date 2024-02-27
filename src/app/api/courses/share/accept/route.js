import { prisma } from "@/libs/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

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

    // Validate data
    let courseCode
    try {
        const body = await req.json()
        if (body.courseCode === '') {
            return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
        }
        courseCode = body.courseCode
    } catch (error) {
        return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
    }

    try {
        // search the invitation        
        const invitation = await prisma.invitations.findFirst({
            where: {
                courseCode,
                receptorId: user.id
            }
        })

        // Validate if the invitation was found
        if (!invitation) {
            return NextResponse.json({ errorMessage: 'Invitación no valida' })
        }

        // Create the reference between the course and the user
        const reference = await prisma.usercourses.create({
            data: {
                userId: user.id,
                courseCode: invitation.courseCode,
                isCreator: false
            }
        })

        // Delete de invitation
        const deleted = await prisma.invitations.delete({
            where: {
                id: invitation.id
            }
        })

        if (!reference || !deleted) {
            return NextResponse.json({ errorMessage: 'Ha ocurrido un error aceptando la inivitación' }, { status: 500 })
        }

        return NextResponse.json({ message: `Invitación aceptada. Ahora formas parte el curso ${invitation.courseName} como profesor` })

    } catch (error) {
        return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
    }
}