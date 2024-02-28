import { z } from "zod";

export const evaluationSchema = z.object({
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
    percentaje: z
        .number({
            required_error: 'Incluye <<< percentaje >>> en la petición',
            invalid_type_error: 'El porcentaje de la evaluación debe ser un numero entero o con hasta 2 decimales'
        })
        .nonnegative({
            message: 'El porcentaje de la evaluación debe estar entre 1 y 100x'
        })
        .max(100, {
            message: 'El porcentaje de la evaluación no puede ser mas de un 100%'
        })
        .multipleOf(0.01, {
            message: 'El porcentaje de la evaluación debe ser un numero entero o con hasta 2 decimales'
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
    isAutoCalculated: z
        .boolean({
            required_error: 'Incluye <<< isAutoCalculated >>> en la petición',
            invalid_type_error: 'El campo (¿La evaluación es autocalculada?) debe ser un valor booleano'
        })
})