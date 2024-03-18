import { z } from "zod";

export const courseSchema = z.object({
    name: z
        .string({
            required_error: "Incluye <<< name >>> en la petición"
        })
        .max(100, {
            message: 'El nombre del curso no puede tener más de 100 caracteres de longitud'
        })
        .min(1, {
            message: 'El nombre del curso es requerido'
        }),
    durationHours: z
        .number({
            required_error: "Incluye <<< durationHours >>> en la petición",
            invalid_type_error: "La duración del curso debe ser un numero entero o con hasta 2 decimales"
        })
        .positive({
            message: 'La duración del curso en horas debe ser un número positivo'
        })
        .multipleOf(0.01, {
            message: 'La duración del curso debe ser un numero entero o con hasta 2 decimales'
        }),
    schedule: z
        .string({ required_error: "Incluye <<< schedule >>> en la petición" })
        .max(500, {
            message: "El horario del curso no puede tener más de 500 caracteres de longitud"
        })
        // .min(1, {
        //     message: 'El horario del curso es requerido'
        // }),
        ,
    startDate: z
        .string({ required_error: "Incluye <<< startDate >>> en la petición" })
        .min(1, {
            message: 'La fecha de inicio del curso es requerida'
        }),
    endDate: z
        .string({ required_error: "Incluye <<< endDate >>> en la petición" })
        .min(1, {
            message: 'La fecha de finalización del curso es requerida'
        }),
    quota: z
        .number({
            required_error: 'Incluye <<< quota >>> en la petición',
            invalid_type_error: 'El cupo maximo del curso debe ser un número entero'
        })
        .positive({
            message: 'El cupo maximo del curso debe ser un número entero'
        })
        .int({
            message: 'El cupo maximo del curso debe ser un número entero'
        }),
    isFinished: z
        .boolean({
            required_error: 'Incluye <<< isFinished >>> en la petición',
            invalid_type_error: 'Indica si el curso ya finalizó con true o false'
        }),
    attendacePercentaje: z
        .number({
            required_error: 'Incluye <<< attendacePercentaje >>> en la petición',
            invalid_type_error: 'El porcentaje de asistencia debe ser un numero entero o con hasta 2 decimales'
        })
        .nonnegative({
            message: 'El porcentaje de asistencia debe estar entre 1 y 100x'
        })
        .max(100, {
            message: 'El porcentaje de asistencia no puede ser mas de un 100%'
        })
        .multipleOf(0.01, {
            message: 'El porcentaje de asistencia debe ser un numero entero o con hasta 2 decimales'
        }),
})