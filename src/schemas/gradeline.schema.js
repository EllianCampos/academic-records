import { z } from "zod";

export const gradeLineSchema = z.object({
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
    studentId: z
        .number({
            required_error: 'Incluye <<< studentId >>> en la petición'
        })
        .int({
            message: 'Debe ser un número entero'
        }),
    gradeHeaderId: z
        .number({
            required_error: 'Incluye <<< gradeHeaderId >>> en la petición'
        })
        .int({
            message: 'Debe ser un número entero'
        }),
    points: z
        .number({
            required_error: 'Incluye <<< points >>> en la petición',
            invalid_type_error: 'Los puntos de la evaluación debe ser un numero entero'
        })
        .nonnegative({
            message: 'Las los puntos deben ser un positivo'
        })
        .int({
            message: 'Los puntos de la evaluación deben ser un valor númerico sin decimales'
        }),
    feedback: z
        .string({
            required_error: 'Incluye <<< feedback >>> en la petición'
        })
        .max(500, {
            message: 'La retroalimentación de la evaluación no puede tener más de 500 caracteres de longitud'
        })
})