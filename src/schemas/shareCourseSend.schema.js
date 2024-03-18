import { z } from "zod";

export const shareCourseSendSchema = z.object({
  courseCode: z
    .string({
      required_error: 'Incluye <<< courseCode >>> en los parametros de la URL'
    })
    .max(4, {
      message: 'El código del curso no puede tener más de 4 caracteres de longitud'
    })
    .min(1, {
      message: 'El código del curso es requerido'
    }),
    emailReceptor: z
    .string({
      required_error: 'Incluye <<< emailreceptor >>> en los parametros de la URL'
    })
    .min(1,{
      message: 'Ingresa el correo electrónico del profesor a cual deseas invitar al curso'
    })
    .email({
      message: 'El formato del correo electrónico no es valido'
    })
})