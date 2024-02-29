import { z } from "zod";

export const gradeHeaderSchema = z.object({
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
    evaluationId: z
        .number({
            required_error: 'Incluye <<< evaluationId >>> en la petición'
        })
        .int({
            message: 'Debe ser un número entero'
        }),
    name: z
        .string({
            required_error: 'Incluye <<< name >>> en la petición'
        })
        .max(100, {
            message: 'El nombre de la evaluación no puede tener más de 100 caracteres de longitud'
        })
        .min(1, {
            message: 'El nombre de la evaluación es requerido'
        }),
    points: z
        .number({
            required_error: 'Incluye <<< points >>> en la petición',
            invalid_type_error: 'Los puntos de la evaluación debe ser un numero entero'
        })
        .positive({
            message: 'Las evaluaciones deben valer al menos 1 punto'
        })
        .int({
            message: 'Los puntos de la evaluación deben ser un valor númerico sin decimales'
        }),
})