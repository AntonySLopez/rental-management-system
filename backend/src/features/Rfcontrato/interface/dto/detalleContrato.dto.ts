import z from "zod";

// DTO de entrada según B7
export const detalleContratoSchema = z.object({
    id: z.coerce.number().int().min(1),
});

export type DetalleContratoDto = z.infer<typeof detalleContratoSchema>;
