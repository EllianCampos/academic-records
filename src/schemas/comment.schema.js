import { z } from "zod";

export const commentSchema = z.object({
    description: z.string({
        required_error: 'Incluye <<< description >>> en la petición'
    })
    .max(1000, {
        message: 'La descripción no puede tener más de 1000 caracteres de longitud'
    })
    .min(5, {
        message: 'La descripción debe contener almenos 5 catacteres'
    })
})