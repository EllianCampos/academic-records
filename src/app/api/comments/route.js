import { prisma } from "@/libs/prisma"
import { commentSchema } from "@/schemas/comment.schema"
import { NextResponse } from "next/server"

export async function POST(req) {
    // Validate request
    let newComment
    try {
        const body = await req.json()
        newComment = commentSchema.safeParse(body)
        if (!newComment.success) {
            return NextResponse.json(newComment.error)
        }
    } catch (error) {
        return NextResponse.json({ errorMessage: 'Formato de peticion no valido' }, { status: 400 })
    }

    try {
        // Create
        const comment = await prisma.comments.create({
            data: {
                description: newComment.data.description
            }
        })

        // Validate if was created
        if (!comment) {
            return NextResponse.json({ errorMessage: 'Ha ocurrido un error guardando el comentario' }, { status: 500 })
        }

        return NextResponse.json({ message: 'Gracias por tu comentario. Realmente nos ayuda a continuar mejorando' })

    } catch (error) {
        return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
    }
}