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

        // Decline the invitation
        const updated = await prisma.invitations.update({
            where: {
                id: invitation.id
            },
            data: {
                state: 'DECLINED'
            }
        })

        // Create the reference between the course and the user
        // const reference = await prisma.usercourses.create({
        //     data: {
        //         userId: user.id,
        //         courseCode: invitation.courseCode,
        //         isCreator: false
        //     }
        // })

        // Delete de invitation
        // const deleted = await prisma.invitations.delete({
        //     where: {
        //         id: invitation.id
        //     }
        // })

        if (!updated) {
            return NextResponse.json({ errorMessage: 'Ha ocurrido un error rechazando la invitación' }, { status: 500 })
        }

        return NextResponse.json({ message: `Invitación rechazada` })

    } catch (error) {
        return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
    }
}