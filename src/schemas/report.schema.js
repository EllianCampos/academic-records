import { z } from "zod";

export const reportSchema = z.object({
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
  bornDate: z
    .string({ required_error: "Incluye <<< bornDate >>> en la petición" })
    .min(1, {
      message: 'La fecha de nacimiento es requerida'
    }),
})