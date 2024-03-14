import { z } from "zod";

export const attendanceSchema = z.object({
    courseCode: z
        .string({
            required_error: 'Incluye <<< courseCode >>> en la petición'
        })
        .max(4, {
            message: 'El código del curso debe estar compuesto por 4 caracteres numéricos o letras en minúscula'
        })
        .min(4, {
            message: 'El código del curso debe estar compuesto por 4 caracteres numéricos o letras en minúscula'
        }),
    description: z
        .string({
            required_error: 'Incluye <<< description >>> en la petición'
        })
        .max(50, {
            message: 'La descripción de la asistencia no puede tener más de 50 caracteres de longitud'
        }),
    date: z
        .string({ required_error: "Incluye <<< date >>> en la petición" })
        .min(1, {
            message: 'La fecha es requerida'
        }),
})