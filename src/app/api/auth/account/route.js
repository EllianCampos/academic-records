import { prisma } from "@/libs/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
    // Validate if the request contains a token
    const token = await getToken({ req })
    if (!token.user.id) return NextResponse.json({
        errorMessage: 'Acceso NO autorizado'
    }, { status: 401 });

    try {
		// Search 
		const user = await prisma.users.findUnique({
			where: {
			    email: token.user.email,
			}
		})

		// Build the response
		const response = {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            email: user.email
        }

		return NextResponse.json(response)

	} catch (error) {
		console.log(error)
		return NextResponse.json({
			errorMessage: 'Error interno del servidor'
		}, { status: 500 })
	}
}