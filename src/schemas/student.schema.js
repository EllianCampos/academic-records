import { z } from "zod";

export const studentSchema = z.object({
    courseCode: z
        .string({
            required_error: "El código del curso es requerido"
        })
        .max(4, {
            message: 'El código del curso no puede tener más de 4 caracteres de longitud'
        }),
    cedula: z.
        number({
            required_error: 'Ingrese la cédula sin guiones ni espacios',
            invalid_type_error: 'Ingrese la cédula sin guiones ni espacios'
        })
        .max(999999999, {
            message: 'La cédula debe contener 9 digitos'
        })
        .min(111111111, {
            message: 'La cédula debe contener 9 digitos'
        }),
    name: z
        .string({
            required_error: 'Incluye un campo <<< name >>> en la petición'
        })
        .max(50, {
            message: 'El nombre no puede tener más de 50 caracteres de longitud'
        })
        .min(1, {
            message: 'El nombre es requerido'
        }),
    lastname: z
        .string({
            required_error: "Los apellidos son requeridos"
        })
        .max(50, {
            message: 'Los apellidos no pueden tener más de 50 caracteres de longitud'
        }),
    bornDate: z
        .string({
            required_error: 'La fecha de nacimiento es requerida',
        }),
    gender: z
        .string({
            required_error: 'El género de la persona es requerido',
        })
        .max(25, {
            message: 'El género no puede tener una longitud de más de 25 caracteres'
        }),
    phone: z
        .string({
            required_error: "El número de teléfono es requerido"
        })
        .max(20, {
            message: 'El número de teléfono no puede tener más de 20 caracteres de longitud'
        }),
    email: z
        .string({
            required_error: 'El correo electrónico es requerido'
        })
        .max(75, {
            message: 'El correo electrónico no puede contener mas de 75 caracteres'
        })
        .email({
            message: 'El formato del correo electrónico no es valido'
        }),
    disability: z
        .string({
            required_error: 'Por favor indique si tiene alguna discapacidad'
        })
        .max(15, {
            message: 'El campo de discapacidad no puede contener mas de 15 caracteres'
        }),
    disabilityDescription: z
        .string()
        .max(100, {
            message: 'La descripción de la discapacidad no puede contener mas de 100 caracteres'
        })
        .optional(),
    provincia: z
        .string()
        .max(80, {
            message: 'La provincia no puede contener mas de 80 caracteres'
        })
        .optional(),
    canton: z
        .string()
        .max(80, {
            message: 'El cantón no puede contener mas de 80 caracteres'
        })
        .optional(),
    distrito: z
        .string()
        .max(80, {
            message: 'El distrito no puede contener mas de 80 caracteres'
        })
        .optional(),
    comunidad: z
        .string()
        .max(80, {
            message: 'La comunidad no puede contener mas de 80 caracteres'
        })
        .optional(),
    observations: z
        .string()
        .max(500, {
            message: 'Las observaciones no puede contener mas de 500 caracteres'
        })
        .optional(),
})