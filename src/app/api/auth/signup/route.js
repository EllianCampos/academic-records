import { NextResponse } from "next/server"
import bcrypt from "bcryptjs";
import { prisma } from "@/libs/prisma";

export async function POST(request) {
	// Validate request data
	let name, lastname, email, password
	try {
		const requestjson = await request.json()
		name = requestjson.name
		lastname = requestjson.lastname
		email = requestjson.email
		password = requestjson.password

		if (!name || name === '') {
			return NextResponse.json({ errorMessage: 'Por favor ingrese un nombre' }, { status: 400 })
		} else if (!lastname || lastname === '') {
			return NextResponse.json({ errorMessage: 'Por favor ingrese los apellidos' }, { status: 400 })
		} else if (!email || email === '') {
			return NextResponse.json({ errorMessage: 'Por favor ingrese un correo valido' }, { status: 400 })
		} else if (!password || password === '') {
			return NextResponse.json({ errorMessage: 'Por favor ingrese una contraseña valida' }, { status: 400 })
		}
	} catch (error) {
		return NextResponse.json({ errorMessage: 'Por favor ingrese todos los datos obligatorios' }, { status: 400 })
	}

	try {
		// Verify if the user already exists
		const user = await prisma.users.findFirst({
			where: {
				email: email
			}
		})

		if (user) {
			return NextResponse.json({ errorMessage: 'El correo no esta disponible' }, { status: 400 })
		}

		// Encrypt password
		const hashedPassword = await bcrypt.hash(password, 12)

		// Create the new user
		const newUser = await prisma.users.create({
			data: { name, lastname, email, password: hashedPassword }
		})

		return NextResponse.json({
			message: 'Registrado existosamente'
		}, { status: 201 })

	} catch (error) { console.log(error)
		return NextResponse.json({
			errorMessage: 'Error interno del servidor'
		}, { status: 500 })
	}
}