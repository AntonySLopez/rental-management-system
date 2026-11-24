import z from "zod";

// DTO de entrada según B7
export const actualizarContratoSchema = z.object({
    local_id: z.coerce.number().int().min(1),
    observaciones: z.string()
        .max(255, "Las observaciones no pueden exceder 255 caracteres")
        .optional(),
});

export type ActualizarContratoDto = z.infer<typeof actualizarContratoSchema>;
