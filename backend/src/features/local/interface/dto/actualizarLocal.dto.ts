import z from "zod";

// DTO de entrada según B7
export const actualizarLocalSchema = z.object({
    id: z.coerce.number().int().min(1),
    nombre: z.string()
        .min(1, "El nombre no puede estar vacío")
        .max(100, "El nombre no puede exceder 100 caracteres")
        .transform(val => val.trim()),
    descripcion: z.string()
        .max(255, "La descripción no puede exceder 255 caracteres")
        .optional(),
    area: z.number()
        .positive("El área debe ser mayor que 0")
        .max(1000, "El área no puede exceder 1000")
        .refine(val => Number.isInteger(val * 100), "El área puede tener máximo 2 decimales")
        .optional(),
});

export type ActualizarLocalDto = z.infer<typeof actualizarLocalSchema>;
