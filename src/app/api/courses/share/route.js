import { prisma } from "@/libs/prisma";
import { shareCourseSendSchema } from "@/schemas/shareCourseSend.schema";
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

	const invitations = await prisma.invitations.findMany({
		where: {
			receptorId: user.id,
			state: 'SENDED'
		}
	})

	return NextResponse.json(invitations)
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

	// Get params
	let courseCode, emailReceptor
	try {
		const searchParams = req.nextUrl.searchParams
		courseCode = searchParams.get("courseCode")
		emailReceptor = searchParams.get("emailReceptor")

		// if (!courseCode || !emailReceptor) {
		// 	return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
		// }
	} catch (error) {
		return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
	}

	console.log(courseCode, emailReceptor, user)

	// Validate request
	let newInvitation
	try {
		newInvitation = shareCourseSendSchema.safeParse({courseCode, emailReceptor})
		if (!newInvitation.success) {
			return NextResponse.json(newInvitation.error)
		}
	} catch (error) {
		return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
	}

	// Search the course
	const emisorUserCourse = await prisma.usercourses.findFirst({
		where: {
			courseCode: courseCode,
			userId: user.id
		},
		include: {
			courses: true
		}
	})

	// Validate if the course exists
	if (!emisorUserCourse) {
		return NextResponse.json({ errorMessage: 'El curso no existe' }, { status: 400 })
	}

	// Validate if the user is the creator of the course
	if (!emisorUserCourse.isCreator) {
		return NextResponse.json({ errorMessage: 'No puedes compartir el curso con alguien más porque no eres el creador' }, { status: 400 })
	}

	// search the receptor user
	const receptorUser = await prisma.users.findFirst({
		where: {
			email: emailReceptor
		}
	})
	if (!receptorUser) {
		return NextResponse.json({ errorMessage: `No se encontro ningun usuario con el correo: ${emailReceptor}` }, { status: 400 })
	}

	// Validate if the user is already into the course
	const receptorIsIntoTheCourse = await prisma.usercourses.findFirst({
		where: {
			courseCode: courseCode,
			userId: receptorUser.id
		}
	})
	if (receptorIsIntoTheCourse) {
		return NextResponse.json({ errorMessage: `El usuario con correo: ${emailReceptor} ya forma parte de este curso` }, { status: 400 })
	}

	// Search the invitation
	const invitationFounded = await prisma.invitations.findFirst({
		where: {
			senderId: user.id,
			receptorId: receptorUser.id,
			courseCode
		}
	})

	// Create the invitation
	if (!invitationFounded) {
		const invitation = await prisma.invitations.create({
			data: {
				senderId: user.id,
				receptorId: receptorUser.id,
				courseCode,
				courseName: emisorUserCourse.courses.name,
				senderName: `${user.name} ${user.lastname}`,
				state: 'SENDED'
			}
		})
		if (invitation) {
			return NextResponse.json({ message: `Invitación enviada exitosamente a ${emailReceptor}` })
		}
	}

	// Validate if the invitation was sended
	if (invitationFounded.state === 'SENDED') {
		return NextResponse.json({ message: `La invitación a ${emailReceptor} ya ha sido enviada` })
	}

	// Validate if the invitation was sended but declined
	if (invitationFounded.state === 'DECLINED') {
		const invitation = await prisma.invitations.update({
			where: {
				id: invitationFounded.id
			},
			data: {
				state: 'SENDED'
			}
		})
		return NextResponse.json({ message: `La invitación a ${emailReceptor} ha sido reenviada` })
	}
}