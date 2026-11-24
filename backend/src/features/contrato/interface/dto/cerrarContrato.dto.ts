import z from "zod";

// DTO de entrada según B7
export const cerrarContratoSchema = z.object({
    id: z.coerce.number().int().min(1),
});

export type CerrarContratoDto = z.infer<typeof cerrarContratoSchema>;
