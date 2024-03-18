import { prisma } from "@/libs/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  // Validate if the request contains a token
  let user = {}
  try {
    let token = await getToken({ req })
    user = token.user
  } catch (error) {
    return NextResponse.json({ errorMessage: 'Acceso NO autorizado' }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams
  const courseCode = searchParams.get("courseCode")
  const userId = searchParams.get('userId')
  if (courseCode === null || userId === null) {
    return NextResponse.json({ errorMessage: 'Formato de peticion no valido' })
  }

  try {
    // Validate if the course exists and belongs to the user
    const found = await prisma.usercourses.findFirst({
      where: {
        courseCode: courseCode,
        userId: user.id
      }
    })
    if (!found) {
      return NextResponse.json({ errorMessage: 'El curso no existe' }, { statu: 404 })
    }

    // Validate if the teacher that is deleting is the creator of the corse
    if (!found.isCreator) return NextResponse.json({ errorMessage: 'No puedes revocar el acceso a otros profesor porque no eres el creador del curso' }, { status: 401 })

     // search for delete
     const relation = await prisma.usercourses.findFirst({
      where: {
        courseCode: courseCode,
        userId: Number(userId)
      }
    })
    if (!relation) return NextResponse.json({errorMessage: 'Error al eliminar el profesor'}, { status: 400 } )  

    // Delete
    const deleted = await prisma.usercourses.delete({
      where: {
        id: relation.id
      }
    })   

    // Validate if was deleted
    if (!deleted) return NextResponse.json({errorMessage: 'Error al eliminar el profesor'}, { status: 400 } )    

    return NextResponse.json({ message: 'Profesor eliminado exitosamente' })

  } catch (error) { console.log(error)
    return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
  }
}