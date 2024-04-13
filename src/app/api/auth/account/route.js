import { prisma } from "@/libs/prisma";
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
		// Search 
		const userFound = await prisma.users.findUnique({
			where: {
				id: user.id,
			}
		})

		// Validate if the user exists
		if (!userFound) {
			return NextResponse.json({ errorMessage: 'El usuario no existe' }, { status: 500 })
		}

		// Build the response
		const response = {
			id: userFound.id,
			name: userFound.name,
			lastname: userFound.lastname,
			email: userFound.email
		}

		return NextResponse.json(response)

	} catch (error) {
		return NextResponse.json({
			errorMessage: 'Error interno del servidor'
		}, { status: 500 })
	}
}