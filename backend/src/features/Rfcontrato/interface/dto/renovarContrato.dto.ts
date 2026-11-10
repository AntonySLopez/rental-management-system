import z from "zod";

// DTO de entrada según B7
export const renovarContratoSchema = z.object({
    fecha_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha debe ser YYYY-MM-DD"),
    precio_mensual: z.number().positive("El precio mensual debe ser mayor a 0")
        .refine(val => Number.isInteger(val * 100), "El precio mensual puede tener máximo 2 decimales")
        .optional(),
    observaciones: z.string()
        .max(255, "Las observaciones no pueden exceder 255 caracteres")
        .optional(),
});

export type RenovarContratoDto = z.infer<typeof renovarContratoSchema>;
