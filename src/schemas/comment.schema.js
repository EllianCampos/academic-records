import { z } from "zod";

export const commentSchema = z.object({
    description: z.string({
        required_error: 'La descripción no puede quedar en blanco'
    })
    .max(1000, {
        message: 'La descripción no puede tener más de 1000 caracteres de longitud'
    })
})