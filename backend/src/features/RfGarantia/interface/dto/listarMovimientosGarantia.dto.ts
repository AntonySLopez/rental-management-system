import z from "zod";

// DTO de entrada según B7
export const listarMovimientosGarantiaSchema = z.object({
    contrato_id: z.number().int().positive("El contrato_id debe ser un entero positivo"),
    page: z.number().int().positive("La página debe ser un entero positivo").optional().default(1),
    limit: z.number().int().positive("El límite debe ser un entero positivo").max(100, "El límite máximo es 100").optional().default(10),
});

export type ListarMovimientosGarantiaDto = z.infer<typeof listarMovimientosGarantiaSchema>;
