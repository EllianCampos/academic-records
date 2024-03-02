import { z } from "zod";

export const studentSchema = z.object({
    courseCode: z
        .string({
            required_error: "Incluye <<< courseCode >>> en la petición"
        })
        .max(4, {
            message: 'El código del curso no puede tener más de 4 caracteres de longitud'
        })
        .min(1, {
            message: 'El código del curso es requerido'
        }),
    cedula: z.
        number({
            required_error: 'Incluye <<< cedula >>> en la petición',
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
            required_error: 'Incluye <<< name >>> en la petición'
        })
        .max(50, {
            message: 'El nombre no puede tener más de 50 caracteres de longitud'
        })
        .min(1, {
            message: 'El nombre es requerido'
        }),
    lastname: z
        .string({
            required_error: 'Incluye <<< lastname >>> en la petición'
        })
        .max(50, {
            message: 'Los apellidos no pueden tener más de 50 caracteres de longitud'
        })
        .min(1, {
            message: 'Los apellidos son requeridos'
        }),
    bornDate: z
        .string({ required_error: "Incluye <<< bornDate >>> en la petición" })
        .min(1, {
            message: 'La fecha de nacimiento es requerida'
        }),
    gender: z
        .string({
            required_error: 'Incluye <<< gender >>> en la petición',
        })
        .max(25, {
            message: 'El género no puede tener una longitud de más de 25 caracteres'
        })
        .min(1, {
            message: 'El género de la persona es requerido'
        }),
    phone: z
        .string({
            required_error: 'Incluye <<< phone >>> en la petición'
        })
        .max(20, {
            message: 'El número de teléfono no puede tener más de 20 caracteres de longitud'
        })
        .min(1, {
            message: 'El numero de teléfono es requerido'
        }),
    email: z
        .string({
            required_error: 'Incluye <<< email >>> en la petición'
        })
        .max(75, {
            message: 'El correo electrónico no puede contener mas de 75 caracteres'
        })
        .min(1, {
            message: 'El correo electrónico es requerido'
        })
        .email({
            message: 'El formato del correo electrónico no es valido'
        }),
    disability: z
        .string({
            required_error: 'Incluye <<< disability >>> en la petición'
        })
        .max(15, {
            message: 'El campo de discapacidad no puede contener mas de 15 caracteres'
        })
        .min(1, {
            message: 'Por favor indique si tiene alguna discapacidad'
        }),
    disabilityDescription: z
        .string({
            required_error: 'Incluye <<< disabilityDescription >>> en la petición'
        })
        .max(100, {
            message: 'La descripción de la discapacidad no puede contener mas de 100 caracteres'
        })
        .optional(),
    provincia: z
        .string({
            required_error: 'Incluye <<< provincia >>> en la petición'
        })
        .max(80, {
            message: 'La provincia no puede contener mas de 80 caracteres'
        })
        .optional(),
    canton: z
        .string({
            required_error: 'Incluye <<< canton >>> en la petición'
        })
        .max(80, {
            message: 'El cantón no puede contener mas de 80 caracteres'
        })
        .optional(),
    distrito: z
        .string({
            required_error: 'Incluye <<< distrito >>> en la petición'
        })
        .max(80, {
            message: 'El distrito no puede contener mas de 80 caracteres'
        })
        .optional(),
    comunidad: z
        .string({
            required_error: 'Incluye <<< comunidad >>> en la petición'
        })
        .max(80, {
            message: 'La comunidad no puede contener mas de 80 caracteres'
        })
        .optional(),
    observations: z
        .string({
            required_error: 'Incluye <<< observations >>> en la petición'
        })
        .max(500, {
            message: 'Las observaciones no puede contener mas de 500 caracteres'
        })
        .optional(),
})