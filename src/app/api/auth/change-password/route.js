import { prisma } from "@/libs/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PUT(req) {
	// Validate if the request contains a token
	const token = await getToken({ req })
	if (!token.user.id) return NextResponse.json({
		errorMessage: 'Acceso NO autorizado'
	}, { status: 401 });


	// Validate request data
	let password, passwordRepeat
	try {
		const requestjson = await req.json()
		password = requestjson.password
		passwordRepeat = requestjson.passwordRepeat

		if (password === '' || passwordRepeat === '') {
			return NextResponse.json({ errorMessage: "Ingresa y repita la contraseña" }, { status: 400 })
		} 
	} catch (error) {
		return NextResponse.json({ errorMessage: "Ingresa y repita la contraseña" }, { status: 400 })
	}

	try {
		// Encrypt password
		const hashedPassword = await bcrypt.hash(password, 12)

		//update password
		const taskUpdated = await prisma.users.update({
			where: {
				id: token.user.id
			},
			data: {
				password: hashedPassword
			}
		})

		// Validate if was updated
		if (!taskUpdated) {
			return NextResponse.json({ errorMessage: 'Error actualizando la contraseña' }, { status: 500 })
		}

		return NextResponse.json({
			message: 'Contraseña actualizada exitosamente',
		}, { status: 200 })

	} catch (error) {
		console.log(error)
		return NextResponse.json({
			errorMessage: 'Error interno del servidor'
		}, { status: 500 })
	}
}