import z from "zod";

// DTO de entrada según B7
export const detalleCuotaSchema = z.object({
    contrato_id: z.number().int().positive("El contrato_id debe ser un entero positivo"),
    cuota_id: z.number().int().positive("El cuota_id debe ser un entero positivo"),
});

export type DetalleCuotaDto = z.infer<typeof detalleCuotaSchema>;
