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
        })
})