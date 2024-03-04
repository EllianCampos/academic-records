import { z } from "zod";

export const attendanceLineSchema = z.object({
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
    attendanceId: z
        .number({
            required_error: 'Incluye <<< attendanceId >>> en la petición'
        })
        .int({
            message: 'Debe ser un número entero'
        }),
    studentId: z
        .number({
            required_error: 'Incluye <<< studentId >>> en la petición'
        })
        .int({
            message: 'Debe ser un número entero'
        }),
    state: z
        .string({
            required_error: 'Incluye <<< state >>> en la petición'
        })
        .max(50, {
            message: 'El estado de la asistencia no puede tener más de 50 caracteres de longitud'
        }),
    observations: z
        .string({
            required_error: 'Incluye <<< observations >>> en la petición'
        })
        .max(500, {
            message: 'Las observaciones de la asistencia no pueden tener más de 500 caracteres de longitud'
        })
})