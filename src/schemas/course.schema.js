import { z } from "zod";

export const courseSchema = z.object({
    name: z
        .string({
            required_error: "El nombre del curso es requerido"
        })
        .max(100, {
            message: 'El nombre del curso no puede tener más de 100 caracteres de longitud'
        }),
    durationHours: z
        .number({
            required_error: "La duración del curso en horas es requerida",
            invalid_type_error: "La duración del curso debe ser un número sin decimales"
        }),
    schedule: z
        .string({ required_error: "El horario del curso es requerido" })
        .max(500, {
            message: "El horario del curso no puede tener más de 500 caracteres de longitud"
        }),
    startDate: z
        // .date({
        //     required_error: "Selecciona la fecha de inicio del curso",
        //     invalid_type_error: "El formato de la fecha de inicio del curso no es valido"
        // }),
        .string({ required_error: "Selecciona la fecha de inicio del curso" }),
    endDate: z
        // .date({
        //     required_error: "Selecciona la fecha de finalización del curso",
        //     invalid_type_error: "El formato de la fecha de finalización del curso no es valido"
        // }),
        .string({ required_error: "Selecciona la fecha de inicio del curso" }),
    quota: z
        .number({
            required_error: "El cupo del curso es requerido",
            invalid_type_error: "El cupo del curso debe ser un número sin decimales"
        }),
    isFinished: z
        .boolean({
            required_error: 'Indica si el curso ya finalizó con true o false',
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