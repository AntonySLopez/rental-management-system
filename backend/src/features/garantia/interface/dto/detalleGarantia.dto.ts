import z from "zod";

// DTO de entrada según B7
export const detalleGarantiaSchema = z.object({
    contrato_id: z.number().int().positive("El contrato_id debe ser un entero positivo"),
});

export type DetalleGarantiaDto = z.infer<typeof detalleGarantiaSchema>;
